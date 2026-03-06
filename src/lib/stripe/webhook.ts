import { createHmac, timingSafeEqual } from 'node:crypto';

import { getStripeWebhookSecret } from '@/lib/stripe/config';

const DEFAULT_WEBHOOK_TOLERANCE_SECONDS = 300;

type StripeWebhookData = {
  object: Record<string, unknown>;
};

export type StripeWebhookEvent = {
  id: string;
  type: string;
  data: StripeWebhookData;
};

export class StripeWebhookVerificationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 400 | 500,
  ) {
    super(message);
    this.name = 'StripeWebhookVerificationError';
  }
}

type ParsedStripeSignature = {
  timestamp: number;
  signatures: string[];
};

function parseStripeSignatureHeader(signatureHeader: string): ParsedStripeSignature {
  const signatures: string[] = [];
  let timestamp: number | null = null;

  for (const rawPart of signatureHeader.split(',')) {
    const [rawKey, rawValue] = rawPart.split('=', 2);
    const key = rawKey?.trim();
    const value = rawValue?.trim();

    if (!key || !value) {
      continue;
    }

    if (key === 't') {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isFinite(parsed)) {
        throw new StripeWebhookVerificationError('Malformed Stripe signature timestamp.', 400);
      }
      timestamp = parsed;
      continue;
    }

    if (key === 'v1') {
      signatures.push(value);
    }
  }

  if (!timestamp || signatures.length === 0) {
    throw new StripeWebhookVerificationError('Malformed stripe-signature header.', 400);
  }

  return {
    timestamp,
    signatures,
  };
}

function assertTimestampWithinTolerance(timestamp: number, toleranceSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const ageSeconds = Math.abs(now - timestamp);

  if (ageSeconds > toleranceSeconds) {
    throw new StripeWebhookVerificationError(
      'Stripe webhook signature timestamp is outside tolerance window.',
      400,
    );
  }
}

function secureCompareHexSignatures(expectedHex: string, candidateHex: string): boolean {
  const expected = Buffer.from(expectedHex, 'hex');
  const candidate = Buffer.from(candidateHex, 'hex');

  if (expected.length !== candidate.length) {
    return false;
  }

  return timingSafeEqual(expected, candidate);
}

function assertStripeEventShape(value: unknown): StripeWebhookEvent {
  if (typeof value !== 'object' || value === null) {
    throw new StripeWebhookVerificationError('Malformed Stripe webhook payload.', 400);
  }

  const obj = value as Record<string, unknown>;
  const id = typeof obj.id === 'string' ? obj.id : '';
  const type = typeof obj.type === 'string' ? obj.type : '';
  const data = typeof obj.data === 'object' && obj.data !== null ? obj.data : null;
  const dataObject =
    data && typeof (data as { object?: unknown }).object === 'object'
      ? ((data as { object: Record<string, unknown> }).object ?? null)
      : null;

  if (!id || !type || !data || !dataObject) {
    throw new StripeWebhookVerificationError('Malformed Stripe webhook payload.', 400);
  }

  return {
    id,
    type,
    data: {
      object: dataObject,
    },
  };
}

export function verifyAndParseStripeWebhookEvent(
  payload: string,
  signatureHeader: string,
  toleranceSeconds = DEFAULT_WEBHOOK_TOLERANCE_SECONDS,
): StripeWebhookEvent {
  const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
  assertTimestampWithinTolerance(timestamp, toleranceSeconds);

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = createHmac('sha256', getStripeWebhookSecret())
    .update(signedPayload, 'utf8')
    .digest('hex');

  const isSignatureValid = signatures.some((signature) =>
    secureCompareHexSignatures(expectedSignature, signature),
  );

  if (!isSignatureValid) {
    throw new StripeWebhookVerificationError('Invalid Stripe webhook signature.', 400);
  }

  try {
    return assertStripeEventShape(JSON.parse(payload));
  } catch (error) {
    if (error instanceof StripeWebhookVerificationError) {
      throw error;
    }

    throw new StripeWebhookVerificationError('Malformed Stripe webhook payload.', 400);
  }
}
