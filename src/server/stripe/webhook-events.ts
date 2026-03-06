import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type { StripeWebhookEvent } from '@/lib/stripe/webhook';

type WebhookProcessingStatus = 'processed' | 'ignored';

export type StripeWebhookProcessResult = {
  status: WebhookProcessingStatus;
  duplicate: boolean;
};

type StripeWebhookHandler = (event: StripeWebhookEvent) => Promise<WebhookProcessingStatus>;

const stripeWebhookHandlers: Record<string, StripeWebhookHandler> = {
  'checkout.session.completed': async (event) => {
    const sessionId = typeof event.data.object.id === 'string' ? event.data.object.id : null;
    const customerEmail =
      typeof event.data.object.customer_details === 'object' && event.data.object.customer_details
        ? typeof (event.data.object.customer_details as { email?: unknown }).email === 'string'
          ? ((event.data.object.customer_details as { email: string }).email ?? null)
          : null
        : null;

    console.info('[stripe-webhook] checkout.session.completed', {
      eventId: event.id,
      sessionId,
      customerEmail,
    });

    // TODO: Persist order/payment state with idempotency keyed by event.id.
    return 'processed';
  },
};

async function markEventFailed(eventId: string, message: string) {
  await prisma.stripeWebhookEvent.update({
    where: { eventId },
    data: {
      status: 'failed',
      error: message.slice(0, 1000),
    },
  });
}

async function markEventProcessed(eventId: string) {
  await prisma.stripeWebhookEvent.update({
    where: { eventId },
    data: {
      status: 'processed',
      processedAt: new Date(),
      error: null,
    },
  });
}

async function reserveWebhookEvent(event: StripeWebhookEvent): Promise<boolean> {
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: event.id,
        eventType: event.type,
        status: 'received',
      },
    });

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return false;
    }

    throw error;
  }
}

export async function processStripeWebhookEvent(
  event: StripeWebhookEvent,
): Promise<StripeWebhookProcessResult> {
  const reserved = await reserveWebhookEvent(event);

  if (!reserved) {
    console.info('[stripe-webhook] duplicate event skipped', {
      eventId: event.id,
      eventType: event.type,
    });

    return {
      status: 'ignored',
      duplicate: true,
    };
  }

  const handler = stripeWebhookHandlers[event.type];

  try {
    if (!handler) {
      await markEventProcessed(event.id);

      console.info('[stripe-webhook] unhandled event stored as processed', {
        eventId: event.id,
        eventType: event.type,
      });

      return {
        status: 'ignored',
        duplicate: false,
      };
    }

    const status = await handler(event);
    await markEventProcessed(event.id);

    console.info('[stripe-webhook] event processed', {
      eventId: event.id,
      eventType: event.type,
      status,
    });

    return {
      status,
      duplicate: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook processing failure.';
    await markEventFailed(event.id, message);

    console.error('[stripe-webhook] event processing failed', {
      eventId: event.id,
      eventType: event.type,
      message,
    });

    throw error;
  }
}
