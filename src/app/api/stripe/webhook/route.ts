import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getStripeWebhookSecret } from '@/lib/stripe/config';
import { getErrorMessage, isStripeError } from '@/lib/stripe/errors';
import { getStripeServerClient } from '@/lib/stripe/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { ok: false, message: 'Missing stripe-signature header.' },
      { status: 400 },
    );
  }

  const rawPayload = await request.text();

  try {
    const stripe = getStripeServerClient();
    const event = stripe.webhooks.constructEvent(rawPayload, signature, getStripeWebhookSecret());

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // TODO: Persist order/payment state with idempotency protection keyed by event.id.
        console.info('[stripe-webhook] checkout completed', {
          eventId: event.id,
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          paymentStatus: session.payment_status,
        });
        break;
      }
      default:
        console.info('[stripe-webhook] received', { eventId: event.id, type: event.type });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isStripeError(error)) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { ok: false, message: getErrorMessage(error, 'Unable to process Stripe webhook.') },
      { status: 500 },
    );
  }
}
