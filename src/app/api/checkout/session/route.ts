import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripeCatalogById, type StripeCatalogItemId } from '@/features/checkout/cart';
import type { CheckoutAddress, CheckoutLineItem } from '@/features/checkout/types';
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from '@/features/checkout/stripe-types';
import { getStripeServerClient } from '@/lib/stripe/server';

const SHIPPING_FEE_MINOR = 800;
const FREE_SHIPPING_THRESHOLD_MINOR = 12000;
const CURRENCY = 'gbp';
const MAX_LINE_QUANTITY = 20;

export const runtime = 'nodejs';

type SessionLine = {
  id: StripeCatalogItemId;
  quantity: number;
};

function getSiteUrl() {
  const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) {
    return 'http://localhost:3000';
  }

  try {
    return new URL(configured).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getObjectField<T extends string>(obj: Record<string, unknown>, field: T) {
  const value = obj[field];
  return isObject(value) ? value : null;
}

function normalizeAddress(value: unknown): CheckoutAddress {
  const obj = isObject(value) ? value : {};

  return {
    firstName: typeof obj.firstName === 'string' ? obj.firstName : '',
    lastName: typeof obj.lastName === 'string' ? obj.lastName : '',
    company: typeof obj.company === 'string' ? obj.company : '',
    addressLine1: typeof obj.addressLine1 === 'string' ? obj.addressLine1 : '',
    addressLine2: typeof obj.addressLine2 === 'string' ? obj.addressLine2 : '',
    city: typeof obj.city === 'string' ? obj.city : '',
    region: typeof obj.region === 'string' ? obj.region : '',
    postalCode: typeof obj.postalCode === 'string' ? obj.postalCode : '',
    country: typeof obj.country === 'string' ? obj.country : '',
  };
}

function sanitizeLineItems(lines: CheckoutLineItem[]) {
  const sanitized: SessionLine[] = [];

  for (const line of lines) {
    if (!line || typeof line.id !== 'string' || !(line.id in stripeCatalogById)) {
      continue;
    }

    const normalizedQuantity = Number.isFinite(line.quantity)
      ? Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.floor(line.quantity)))
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
        newsletterOptIn: Boolean(customer.newsletterOptIn),
      },
      lines: draftOrder.lines as CheckoutLineItem[],
      shippingAddress: normalizeAddress(draftOrder.shippingAddress),
      billingAddress: normalizeAddress(draftOrder.billingAddress),
      delivery: {
        method: delivery.method === 'nursery_pickup' ? 'nursery_pickup' : 'home_delivery',
        preferredDate:
          typeof delivery.preferredDate === 'string'
            ? delivery.preferredDate
            : typeof delivery.date === 'string'
              ? delivery.date
              : '',
        deliveryNotes: typeof delivery.deliveryNotes === 'string' ? delivery.deliveryNotes : '',
        gardeningNote: typeof delivery.gardeningNote === 'string' ? delivery.gardeningNote : '',
      },
      checkoutState: {
        paymentStatus: 'pending_payment_setup',
        orderStatus: 'draft',
      },
    },
  };
}

type CheckoutSessionErrorCode = Extract<CreateCheckoutSessionResponse, { ok: false }>['code'];

function buildError(code: CheckoutSessionErrorCode, message: string, status: number) {
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

    const siteUrl = getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      customer_email: body.draftOrder.customer.email || undefined,
      client_reference_id: `draft-${Date.now()}`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        deliveryMethod: body.draftOrder.delivery.method,
        preferredDeliveryDate: body.draftOrder.delivery.preferredDate,
        deliveryNotes: body.draftOrder.delivery.deliveryNotes.slice(0, 500),
        gardeningNote: body.draftOrder.delivery.gardeningNote.slice(0, 500),
        newsletterOptIn: String(body.draftOrder.customer.newsletterOptIn),
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
