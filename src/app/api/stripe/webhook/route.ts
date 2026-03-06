import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  StripeWebhookVerificationError,
  verifyAndParseStripeWebhookEvent,
} from '@/lib/stripe/webhook';
import { processStripeWebhookEvent } from '@/server/stripe/webhook-events';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.warn('[stripe-webhook] rejected: missing signature header');
    return NextResponse.json(
      { ok: false, message: 'Missing stripe-signature header.' },
      { status: 400 },
    );
  }

  const rawPayload = await request.text();

  try {
    const event = verifyAndParseStripeWebhookEvent(rawPayload, signature);

    console.info('[stripe-webhook] received', {
      eventId: event.id,
      eventType: event.type,
    });

    const result = await processStripeWebhookEvent(event);

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      status: result.status,
    });
  } catch (error) {
    if (error instanceof StripeWebhookVerificationError) {
      console.warn('[stripe-webhook] rejected: verification failed', {
        message: error.message,
      });

      return NextResponse.json({ ok: false, message: error.message }, { status: error.statusCode });
    }

    const message = error instanceof Error ? error.message : 'Unable to process Stripe webhook.';

    console.error('[stripe-webhook] failed', {
      message,
    });

    return NextResponse.json(
      { ok: false, message: 'Unable to process Stripe webhook.' },
      { status: 500 },
    );
  }
}
