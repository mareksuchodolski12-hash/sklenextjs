const stripeApiVersion = '2025-02-24.acacia' as const;

export function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }

  return key;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
  }

  return secret;
}

export function getStripePublishableKey() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured.');
  }

  return key;
}

export { stripeApiVersion };
