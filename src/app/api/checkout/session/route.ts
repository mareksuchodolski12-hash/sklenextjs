import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripeCatalogById, type StripeCatalogItemId } from '@/features/checkout/cart';
import type { CheckoutLineItem } from '@/features/checkout/types';
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from '@/features/checkout/stripe-types';
import { getStripeServerClient } from '@/lib/stripe/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SHIPPING_FEE_MINOR = 800;
const FREE_SHIPPING_THRESHOLD_MINOR = 12000;
const CURRENCY = 'gbp';

type SessionLine = {
  id: StripeCatalogItemId;
  quantity: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getObjectField<T extends string>(obj: Record<string, unknown>, field: T) {
  const value = obj[field];
  return isObject(value) ? value : null;
}

function sanitizeLineItems(lines: CheckoutLineItem[]) {
  const sanitized: SessionLine[] = [];

  for (const line of lines) {
    if (!line || typeof line.id !== 'string') {
      continue;
    }

    if (!(line.id in stripeCatalogById)) {
      continue;
    }

    const normalizedQuantity = Number.isFinite(line.quantity)
      ? Math.max(1, Math.min(20, Math.floor(line.quantity)))
      : 1;

    sanitized.push({
      id: line.id as StripeCatalogItemId,
      quantity: normalizedQuantity,
    });
  }

  return sanitized;
}

function parseRequestBody(value: unknown): CreateCheckoutSessionRequest | null {
  if (!isObject(value)) {
    return null;
  }

  const draftOrder = getObjectField(value, 'draftOrder');
  const customer = draftOrder ? getObjectField(draftOrder, 'customer') : null;
  const delivery = draftOrder ? getObjectField(draftOrder, 'delivery') : null;

  if (!draftOrder || !customer || !delivery || !Array.isArray(draftOrder.lines)) {
    return null;
  }

  return {
    draftOrder: {
      customer: {
        email: typeof customer.email === 'string' ? customer.email : '',
        phone: typeof customer.phone === 'string' ? customer.phone : '',
      },
      lines: draftOrder.lines as CheckoutLineItem[],
      shippingAddress: (getObjectField(
        draftOrder,
        'shippingAddress',
      ) as CreateCheckoutSessionRequest['draftOrder']['shippingAddress']) ?? {
        firstName: '',
        lastName: '',
        addressLine1: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
      },
      billingAddress: (getObjectField(
        draftOrder,
        'billingAddress',
      ) as CreateCheckoutSessionRequest['draftOrder']['billingAddress']) ?? {
        firstName: '',
        lastName: '',
        addressLine1: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
      },
      delivery: {
        method: delivery.method === 'nursery_pickup' ? 'nursery_pickup' : 'home_delivery',
        date: typeof delivery.date === 'string' ? delivery.date : '',
        deliveryNotes: typeof delivery.deliveryNotes === 'string' ? delivery.deliveryNotes : '',
        gardeningNote: typeof delivery.gardeningNote === 'string' ? delivery.gardeningNote : '',
      },
    },
  };
}

function buildError(code: CreateCheckoutSessionResponse['code'], message: string, status: number) {
  return NextResponse.json<CreateCheckoutSessionResponse>(
    {
      ok: false,
      code,
      message,
    },
    { status },
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = parseRequestBody(await request.json());

    if (!body) {
      return buildError('BAD_REQUEST', 'Invalid checkout payload.', 400);
    }

    const lines = sanitizeLineItems(body.draftOrder.lines);

    if (lines.length === 0) {
      return buildError('INVALID_CART', 'No valid cart lines were provided.', 400);
    }

    const stripe = getStripeServerClient();
    const subtotalMinor = lines.reduce(
      (sum, line) => sum + stripeCatalogById[line.id].unitAmountMinor * line.quantity,
      0,
    );

    const deliveryMinor = subtotalMinor >= FREE_SHIPPING_THRESHOLD_MINOR ? 0 : SHIPPING_FEE_MINOR;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: stripeCatalogById[line.id].unitAmountMinor,
        product_data: {
          name: stripeCatalogById[line.id].name,
          description: stripeCatalogById[line.id].description,
        },
      },
    }));

    if (deliveryMinor > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: deliveryMinor,
          product_data: {
            name: 'Delivery',
            description: 'Nursery dispatch and handling',
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
      customer_email: body.draftOrder.customer.email || undefined,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        deliveryMethod: body.draftOrder.delivery.method,
        deliveryDate: body.draftOrder.delivery.date,
        deliveryNotes: body.draftOrder.delivery.deliveryNotes.slice(0, 500),
        gardeningNote: body.draftOrder.delivery.gardeningNote.slice(0, 500),
      },
      line_items: lineItems,
    });

    if (!session.url || !session.id) {
      return buildError('STRIPE_ERROR', 'Stripe checkout URL was not returned.', 502);
    }

    return NextResponse.json<CreateCheckoutSessionResponse>({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return buildError('BAD_REQUEST', 'Malformed JSON payload.', 400);
    }

    if (error instanceof Stripe.errors.StripeError) {
      return buildError('STRIPE_ERROR', error.message, 502);
    }

    if (error instanceof Error && error.message.includes('STRIPE_SECRET_KEY')) {
      return buildError('CONFIG_ERROR', error.message, 500);
    }

    return buildError('UNKNOWN_ERROR', 'Unable to create checkout session.', 500);
  }
}
