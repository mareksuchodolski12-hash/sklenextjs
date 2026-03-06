import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { StripeWebhookEvent } from '@/lib/stripe/webhook';
import { createStripeWebhookEventProcessor } from '@/server/stripe/webhook-events';

type EventStatus = 'received' | 'failed' | 'processed';

type EventRecord = {
  eventId: string;
  eventType: string;
  status: EventStatus;
  error: string | null;
  processedAt: Date | null;
};

function createWebhookEvent(): StripeWebhookEvent {
  return {
    id: 'evt_checkout_completed',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        customer_email: 'customer@example.com',
        currency: 'gbp',
        amount_subtotal: 1000,
        amount_total: 1800,
        payment_status: 'paid',
        created: 1_700_000_000,
        payment_intent: 'pi_123',
        metadata: {
          deliveryMethod: 'home_delivery',
        },
      },
    },
  };
}

function createWebhookEventVariant(overrides: {
  eventId?: string;
  sessionId?: string;
}): StripeWebhookEvent {
  const event = createWebhookEvent();

  if (overrides.eventId) {
    event.id = overrides.eventId;
  }

  if (overrides.sessionId) {
    event.data.object.id = overrides.sessionId;
  }

  return event;
}

function createHarness(options?: {
  failRetrieveAttempts?: number;
  onRetrieveLineItems?: () => Promise<void> | void;
  failEmailSend?: boolean;
  failEmailSendAttempts?: number;
  onSendConfirmationEmail?: () => Promise<void> | void;
}) {
  const events = new Map<string, EventRecord>();
  const ordersBySessionId = new Map<
    string,
    {
      id: string;
      completedAt: Date | null;
      confirmationEmailSendingAt: Date | null;
      confirmationEmailSentAt: Date | null;
    }
  >();
  let failRetrieveAttempts = options?.failRetrieveAttempts ?? 0;
  let failEmailSendAttempts = options?.failEmailSendAttempts ?? 0;
  let orderIdSequence = 0;

  const counters = {
    retrieveLineItems: 0,
    orderUpsert: 0,
    orderItemDeleteMany: 0,
    orderItemCreateMany: 0,
    paymentUpsert: 0,
    confirmationEmailSend: 0,
  };

  const txClient = {
    order: {
      upsert: async ({
        where,
        create,
        update,
      }: {
        where: { stripeSessionId: string };
        create: { completedAt: Date | null };
        update: { completedAt: Date | null };
      }) => {
        counters.orderUpsert += 1;
        const existingOrder = ordersBySessionId.get(where.stripeSessionId);

        if (existingOrder) {
          const updatedOrder = {
            ...existingOrder,
            completedAt: update.completedAt ?? existingOrder.completedAt,
          };
          ordersBySessionId.set(where.stripeSessionId, updatedOrder);
          return updatedOrder;
        }

        orderIdSequence += 1;
        const createdOrder = {
          id: `order_${orderIdSequence}`,
          completedAt: create.completedAt ?? null,
          confirmationEmailSendingAt: null,
          confirmationEmailSentAt: null,
        };
        ordersBySessionId.set(where.stripeSessionId, createdOrder);
        return createdOrder;
      },
      updateMany: async ({
        where,
        data,
      }: {
        where: {
          id: string;
          completedAt?: { not: null };
          confirmationEmailSentAt?: null;
          confirmationEmailSendingAt?: null | { not: null };
        };
        data: {
          confirmationEmailSendingAt?: Date | null;
          confirmationEmailSentAt?: Date | null;
        };
      }) => {
        const sessionEntry = [...ordersBySessionId.entries()].find(([, order]) => order.id === where.id);
        if (!sessionEntry) {
          return { count: 0 };
        }

        const [sessionId, order] = sessionEntry;

        if (where.completedAt && order.completedAt === null) {
          return { count: 0 };
        }

        if (where.confirmationEmailSentAt === null && order.confirmationEmailSentAt !== null) {
          return { count: 0 };
        }

        if (where.confirmationEmailSendingAt === null && order.confirmationEmailSendingAt !== null) {
          return { count: 0 };
        }

        if (
          where.confirmationEmailSendingAt &&
          'not' in where.confirmationEmailSendingAt &&
          where.confirmationEmailSendingAt.not === null &&
          order.confirmationEmailSendingAt === null
        ) {
          return { count: 0 };
        }

        ordersBySessionId.set(sessionId, {
          ...order,
          confirmationEmailSendingAt:
            data.confirmationEmailSendingAt === undefined
              ? order.confirmationEmailSendingAt
              : data.confirmationEmailSendingAt,
          confirmationEmailSentAt:
            data.confirmationEmailSentAt === undefined
              ? order.confirmationEmailSentAt
              : data.confirmationEmailSentAt,
        });

        return { count: 1 };
      },
    },
    orderItem: {
      deleteMany: async () => {
        counters.orderItemDeleteMany += 1;
      },
      createMany: async () => {
        counters.orderItemCreateMany += 1;
      },
    },
    payment: {
      upsert: async () => {
        counters.paymentUpsert += 1;
      },
    },
  };

  const prismaClient = {
    ...txClient,
    stripeWebhookEvent: {
      create: async ({ data }: { data: { eventId: string; eventType: string; status: string } }) => {
        if (events.has(data.eventId)) {
          const duplicateError = new Error(`Duplicate event ${data.eventId}`);
          (duplicateError as { code?: string }).code = 'P2002';
          throw duplicateError;
        }

        events.set(data.eventId, {
          eventId: data.eventId,
          eventType: data.eventType,
          status: data.status as EventStatus,
          processedAt: null,
          error: null,
        });
      },
      updateMany: async ({
        where,
        data,
      }: {
        where: { eventId: string; status?: string };
        data: {
          status?: string;
          processedAt?: Date | null;
          error?: string | null;
        };
      }) => {
        const existing = events.get(where.eventId);
        if (!existing) {
          return { count: 0 };
        }

        if (where.status && existing.status !== where.status) {
          return { count: 0 };
        }

        events.set(where.eventId, {
          ...existing,
          status: (data.status ?? existing.status) as EventStatus,
          processedAt: data.processedAt === undefined ? existing.processedAt : data.processedAt,
          error: data.error === undefined ? existing.error : data.error,
        });

        return { count: 1 };
      },
    },
    $transaction: async <T>(fn: (client: typeof txClient) => Promise<T>) => fn(txClient),
  };

  const processStripeWebhookEvent = createStripeWebhookEventProcessor({
    prismaClient,
    retrieveLineItems: async () => {
      counters.retrieveLineItems += 1;

      if (failRetrieveAttempts > 0) {
        failRetrieveAttempts -= 1;
        throw new Error('Temporary Stripe line-item retrieval failure.');
      }

      await options?.onRetrieveLineItems?.();

      return [
        {
          id: 'li_1',
          description: 'Monstera Deliciosa',
          quantity: 1,
          currency: 'gbp',
          unitAmountMinor: 1000,
          amountSubtotalMinor: 1000,
          amountTotalMinor: 1000,
        },
      ];
    },
    sendConfirmationEmail: async () => {
      counters.confirmationEmailSend += 1;

      await options?.onSendConfirmationEmail?.();

      if (failEmailSendAttempts > 0) {
        failEmailSendAttempts -= 1;
        throw new Error('SMTP transport unavailable.');
      }

      if (options?.failEmailSend) {
        throw new Error('SMTP transport unavailable.');
      }
    },
    now: () => new Date('2026-03-06T15:30:00.000Z'),
  });

  return {
    processStripeWebhookEvent,
    counters,
    readEvent: (eventId: string) => events.get(eventId),
  };
}

test('processes a new event successfully once', async () => {
  const harness = createHarness();
  const event = createWebhookEvent();

  const result = await harness.processStripeWebhookEvent(event);

  assert.deepEqual(result, {
    status: 'processed',
    duplicate: false,
  });
  assert.equal(harness.readEvent(event.id)?.status, 'processed');
  assert.equal(harness.counters.orderUpsert, 1);
  assert.equal(harness.counters.orderItemDeleteMany, 1);
  assert.equal(harness.counters.orderItemCreateMany, 1);
  assert.equal(harness.counters.paymentUpsert, 1);
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('skips a duplicate event when already processed', async () => {
  const harness = createHarness();
  const event = createWebhookEvent();

  await harness.processStripeWebhookEvent(event);
  const duplicateResult = await harness.processStripeWebhookEvent(event);

  assert.deepEqual(duplicateResult, {
    status: 'ignored',
    duplicate: true,
  });
  assert.equal(harness.readEvent(event.id)?.status, 'processed');
  assert.equal(harness.counters.orderUpsert, 1);
  assert.equal(harness.counters.orderItemCreateMany, 1);
  assert.equal(harness.counters.paymentUpsert, 1);
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('retries a failed event and recovers successfully', async () => {
  const harness = createHarness({ failRetrieveAttempts: 1 });
  const event = createWebhookEvent();

  await assert.rejects(() => harness.processStripeWebhookEvent(event));
  assert.equal(harness.readEvent(event.id)?.status, 'failed');
  assert.equal(harness.counters.orderUpsert, 0);

  const result = await harness.processStripeWebhookEvent(event);

  assert.deepEqual(result, {
    status: 'processed',
    duplicate: false,
  });
  assert.equal(harness.readEvent(event.id)?.status, 'processed');
  assert.equal(harness.counters.orderUpsert, 1);
  assert.equal(harness.counters.orderItemCreateMany, 1);
  assert.equal(harness.counters.paymentUpsert, 1);
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('keeps recovered event immutable on repeated retries', async () => {
  const harness = createHarness({ failRetrieveAttempts: 1 });
  const event = createWebhookEvent();

  await assert.rejects(() => harness.processStripeWebhookEvent(event));
  await harness.processStripeWebhookEvent(event);

  const repeatedRetryResult = await harness.processStripeWebhookEvent(event);

  assert.deepEqual(repeatedRetryResult, {
    status: 'ignored',
    duplicate: true,
  });
  assert.equal(harness.readEvent(event.id)?.status, 'processed');
  assert.equal(harness.counters.orderUpsert, 1);
  assert.equal(harness.counters.orderItemCreateMany, 1);
  assert.equal(harness.counters.paymentUpsert, 1);
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('allows only one reclaim processor when a failed event is retried concurrently', async () => {
  const retryControl: { release: () => void } = {
    release: () => undefined,
  };
  const retryCompletionGate = new Promise<void>((resolve) => {
    retryControl.release = resolve;
  });

  const retryHandlerControl: { started: () => void } = {
    started: () => undefined,
  };
  const retryHandlerStartedPromise = new Promise<void>((resolve) => {
    retryHandlerControl.started = resolve;
  });

  const harness = createHarness({
    failRetrieveAttempts: 1,
    onRetrieveLineItems: async () => {
      retryHandlerControl.started();
      await retryCompletionGate;
    },
  });
  const event = createWebhookEvent();

  await assert.rejects(() => harness.processStripeWebhookEvent(event));
  assert.equal(harness.readEvent(event.id)?.status, 'failed');

  const firstRetry = harness.processStripeWebhookEvent(event);
  await retryHandlerStartedPromise;

  const duplicateRetry = await harness.processStripeWebhookEvent(event);
  retryControl.release();
  const firstRetryResult = await firstRetry;

  assert.deepEqual(firstRetryResult, {
    status: 'processed',
    duplicate: false,
  });
  assert.deepEqual(duplicateRetry, {
    status: 'ignored',
    duplicate: true,
  });
  assert.equal(harness.readEvent(event.id)?.status, 'processed');
  assert.equal(harness.counters.orderUpsert, 1);
  assert.equal(harness.counters.orderItemCreateMany, 1);
  assert.equal(harness.counters.paymentUpsert, 1);
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('does not fail webhook processing when confirmation email sending fails', async () => {
  const harness = createHarness({ failEmailSend: true });
  const event = createWebhookEvent();

  const result = await harness.processStripeWebhookEvent(event);
  const duplicateResult = await harness.processStripeWebhookEvent(event);

  assert.deepEqual(result, {
    status: 'processed',
    duplicate: false,
  });
  assert.deepEqual(duplicateResult, {
    status: 'ignored',
    duplicate: true,
  });
  assert.equal(harness.readEvent(event.id)?.status, 'processed');
  assert.equal(harness.counters.orderUpsert, 1);
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('sends only one confirmation email when two completion events race for same order', async () => {
  const emailSendControl: { release: () => void } = { release: () => undefined };
  const emailSendGate = new Promise<void>((resolve) => {
    emailSendControl.release = resolve;
  });

  const emailSendStartedControl: { started: () => void } = { started: () => undefined };
  const emailSendStarted = new Promise<void>((resolve) => {
    emailSendStartedControl.started = resolve;
  });

  const harness = createHarness({
    onSendConfirmationEmail: async () => {
      emailSendStartedControl.started();
      await emailSendGate;
    },
  });

  const firstEvent = createWebhookEventVariant({
    eventId: 'evt_checkout_completed_1',
    sessionId: 'cs_shared_session',
  });
  const secondEvent = createWebhookEventVariant({
    eventId: 'evt_checkout_completed_2',
    sessionId: 'cs_shared_session',
  });

  const firstProcessing = harness.processStripeWebhookEvent(firstEvent);
  await emailSendStarted;
  const secondResult = await harness.processStripeWebhookEvent(secondEvent);
  emailSendControl.release();
  const firstResult = await firstProcessing;

  assert.deepEqual(firstResult, {
    status: 'processed',
    duplicate: false,
  });
  assert.deepEqual(secondResult, {
    status: 'processed',
    duplicate: false,
  });
  assert.equal(harness.counters.confirmationEmailSend, 1);
});

test('retries confirmation email on later event after prior send failure', async () => {
  const harness = createHarness({
    failEmailSendAttempts: 1,
  });
  const firstEvent = createWebhookEventVariant({
    eventId: 'evt_checkout_completed_email_fail',
    sessionId: 'cs_email_retry_session',
  });
  const retryEvent = createWebhookEventVariant({
    eventId: 'evt_checkout_completed_email_retry',
    sessionId: 'cs_email_retry_session',
  });

  const firstResult = await harness.processStripeWebhookEvent(firstEvent);
  const retryResult = await harness.processStripeWebhookEvent(retryEvent);

  assert.deepEqual(firstResult, {
    status: 'processed',
    duplicate: false,
  });
  assert.deepEqual(retryResult, {
    status: 'processed',
    duplicate: false,
  });
  assert.equal(harness.counters.confirmationEmailSend, 2);
});
