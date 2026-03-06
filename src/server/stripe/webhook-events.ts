import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import {
  retrieveStripeCheckoutSessionLineItems,
  type StripeCheckoutSessionLineItem,
} from '@/lib/stripe/http';
import type { StripeWebhookEvent } from '@/lib/stripe/webhook';
import {
  sendOrderConfirmationEmail,
  type OrderConfirmationEmailPayload,
} from '@/server/email/order-confirmation';

type WebhookProcessingStatus = 'processed' | 'ignored';

export type StripeWebhookProcessResult = {
  status: WebhookProcessingStatus;
  duplicate: boolean;
};

type StripeWebhookHandler = (event: StripeWebhookEvent) => Promise<WebhookProcessingStatus>;

type StripeWebhookEventStore = {
  create(args: {
    data: {
      eventId: string;
      eventType: string;
      status: string;
    };
  }): Promise<unknown>;
  updateMany(args: {
    where: {
      eventId: string;
      status?: string;
    };
    data: {
      status?: string;
      processedAt?: Date | null;
      error?: string | null;
    };
  }): Promise<{ count: number }>;
};

type StripeWebhookOrderStore = {
  upsert(args: Record<string, unknown>): Promise<{
    id: string;
    completedAt: Date | null;
    confirmationEmailSendingAt?: Date | null;
    confirmationEmailSentAt?: Date | null;
  }>;
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
};

type StripeWebhookOrderItemStore = {
  deleteMany(args: Record<string, unknown>): Promise<unknown>;
  createMany(args: Record<string, unknown>): Promise<unknown>;
};

type StripeWebhookPaymentStore = {
  upsert(args: Record<string, unknown>): Promise<unknown>;
};

type StripeWebhookTransactionClient = {
  order: StripeWebhookOrderStore;
  orderItem: StripeWebhookOrderItemStore;
  payment: StripeWebhookPaymentStore;
};

type StripeWebhookPersistenceClient = StripeWebhookTransactionClient & {
  stripeWebhookEvent: StripeWebhookEventStore;
  $transaction<T>(fn: (tx: StripeWebhookTransactionClient) => Promise<T>): Promise<T>;
};

type StripeWebhookProcessingDependencies = {
  prismaClient: StripeWebhookPersistenceClient;
  retrieveLineItems(sessionId: string): Promise<StripeCheckoutSessionLineItem[]>;
  sendConfirmationEmail(payload: OrderConfirmationEmailPayload): Promise<void>;
  now(): Date;
};

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asUnixTimestamp(value: unknown): Date | null {
  const seconds = asNumber(value);
  return seconds === null ? null : new Date(seconds * 1000);
}

function asJsonObject(value: unknown): Prisma.InputJsonValue | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([, entry]) => typeof entry === 'string',
  );

  return Object.fromEntries(entries) as Prisma.InputJsonValue;
}

function isUniqueConstraintError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P2002';
  }

  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

const defaultProcessingDependencies: StripeWebhookProcessingDependencies = {
  prismaClient: prisma as unknown as StripeWebhookPersistenceClient,
  retrieveLineItems: retrieveStripeCheckoutSessionLineItems,
  sendConfirmationEmail: sendOrderConfirmationEmail,
  now: () => new Date(),
};

export function createStripeWebhookEventProcessor(
  overrides: Partial<StripeWebhookProcessingDependencies> = {},
) {
  const { prismaClient, retrieveLineItems, sendConfirmationEmail, now } = {
    ...defaultProcessingDependencies,
    ...overrides,
  };

  const stripeWebhookHandlers: Record<string, StripeWebhookHandler> = {
    'checkout.session.completed': async (event) => {
      const sessionId = asString(event.data.object.id);
      if (!sessionId) {
        throw new Error('Missing Stripe checkout session id.');
      }

      const customerEmail =
        asString(event.data.object.customer_email) ??
        (typeof event.data.object.customer_details === 'object' && event.data.object.customer_details
          ? asString((event.data.object.customer_details as { email?: unknown }).email)
          : null);

      const lineItems = await retrieveLineItems(sessionId);
      const orderMetadata = asJsonObject(event.data.object.metadata);
      const currency = asString(event.data.object.currency);
      const amountSubtotalMinor = asNumber(event.data.object.amount_subtotal);
      const amountTotalMinor = asNumber(event.data.object.amount_total);
      const paymentStatus = asString(event.data.object.payment_status);
      const completedAt = asUnixTimestamp(event.data.object.created);
      const stripePaymentIntentId = asString(event.data.object.payment_intent);

      console.info('[stripe-webhook] checkout.session.completed', {
        eventId: event.id,
        sessionId,
        customerEmail,
        lineItems: lineItems.length,
      });

      const order = await prismaClient.$transaction(async (tx) => {
        const order = await tx.order.upsert({
          where: { stripeSessionId: sessionId },
          create: {
            stripeSessionId: sessionId,
            customerEmail,
            currency,
            amountSubtotalMinor,
            amountTotalMinor,
            paymentStatus,
            metadata: orderMetadata,
            completedAt,
          },
          update: {
            customerEmail,
            currency,
            amountSubtotalMinor,
            amountTotalMinor,
            paymentStatus,
            metadata: orderMetadata,
            completedAt,
          },
        });

        await tx.orderItem.deleteMany({
          where: { orderId: order.id },
        });

        if (lineItems.length > 0) {
          await tx.orderItem.createMany({
            data: lineItems.map((item) => ({
              orderId: order.id,
              stripeLineItemId: item.id,
              description: item.description ?? 'No description provided',
              quantity: item.quantity,
              currency: item.currency,
              unitAmountMinor: item.unitAmountMinor,
              amountSubtotalMinor: item.amountSubtotalMinor,
              amountTotalMinor: item.amountTotalMinor,
            })),
          });
        }

        await tx.payment.upsert({
          where: { stripeSessionId: sessionId },
          create: {
            orderId: order.id,
            stripeSessionId: sessionId,
            stripePaymentIntentId,
            customerEmail,
            currency,
            amountMinor: amountTotalMinor,
            status: paymentStatus ?? 'unknown',
            raw: event.data.object as Prisma.InputJsonValue,
          },
          update: {
            orderId: order.id,
            stripePaymentIntentId,
            customerEmail,
            currency,
            amountMinor: amountTotalMinor,
            status: paymentStatus ?? 'unknown',
            raw: event.data.object as Prisma.InputJsonValue,
          },
        });

        return order;
      });

      const emailSendClaim = await prismaClient.order.updateMany({
        where: {
          id: order.id,
          completedAt: {
            not: null,
          },
          confirmationEmailSentAt: null,
          confirmationEmailSendingAt: null,
        },
        data: {
          confirmationEmailSendingAt: now(),
        },
      });

      if (emailSendClaim.count > 0) {
        try {
          await sendConfirmationEmail({
            orderReference: order.id,
            customerEmail,
            currency,
            totalMinor: amountTotalMinor,
            items: lineItems.map((item) => ({
              description: item.description ?? 'No description provided',
              quantity: item.quantity,
              amountTotalMinor: item.amountTotalMinor,
              currency: item.currency,
            })),
          });

          await prismaClient.order.updateMany({
            where: {
              id: order.id,
              confirmationEmailSentAt: null,
              confirmationEmailSendingAt: {
                not: null,
              },
            },
            data: {
              confirmationEmailSentAt: now(),
              confirmationEmailSendingAt: null,
            },
          });

          console.info('[stripe-webhook] order confirmation email sent', {
            eventId: event.id,
            sessionId,
            orderReference: order.id,
            customerEmail,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown order confirmation email failure.';

          await prismaClient.order.updateMany({
            where: {
              id: order.id,
              confirmationEmailSentAt: null,
              confirmationEmailSendingAt: {
                not: null,
              },
            },
            data: {
              confirmationEmailSendingAt: null,
            },
          });

          console.error('[stripe-webhook] order confirmation email failed', {
            eventId: event.id,
            sessionId,
            orderReference: order.id,
            customerEmail,
            message,
          });
        }
      }

      return 'processed';
    },
  };

  async function markEventFailed(eventId: string, message: string) {
    await prismaClient.stripeWebhookEvent.updateMany({
      where: {
        eventId,
        status: 'received',
      },
      data: {
        status: 'failed',
        error: message.slice(0, 1000),
      },
    });
  }

  async function markEventProcessed(eventId: string) {
    await prismaClient.stripeWebhookEvent.updateMany({
      where: {
        eventId,
        status: 'received',
      },
      data: {
        status: 'processed',
        processedAt: now(),
        error: null,
      },
    });
  }

  async function reserveWebhookEvent(event: StripeWebhookEvent): Promise<boolean> {
    try {
      await prismaClient.stripeWebhookEvent.create({
        data: {
          eventId: event.id,
          eventType: event.type,
          status: 'received',
        },
      });

      return true;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const failedEventUpdate = await prismaClient.stripeWebhookEvent.updateMany({
          where: {
            eventId: event.id,
            status: 'failed',
          },
          data: {
            status: 'received',
            processedAt: null,
            error: null,
          },
        });

        return failedEventUpdate.count > 0;
      }

      throw error;
    }
  }

  return async function processStripeWebhookEvent(
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
  };
}

export const processStripeWebhookEvent = createStripeWebhookEventProcessor();
