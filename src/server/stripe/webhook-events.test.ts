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

function createHarness(options?: {
  failRetrieveAttempts?: number;
}) {
  const events = new Map<string, EventRecord>();
  let failRetrieveAttempts = options?.failRetrieveAttempts ?? 0;

  const counters = {
    retrieveLineItems: 0,
    orderUpsert: 0,
    orderItemDeleteMany: 0,
    orderItemCreateMany: 0,
    paymentUpsert: 0,
  };

  const txClient = {
    order: {
      upsert: async () => {
        counters.orderUpsert += 1;
        return { id: 'order_1' };
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
});
