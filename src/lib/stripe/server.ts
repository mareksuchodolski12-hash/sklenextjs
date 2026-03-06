import Stripe from 'stripe';

import { getStripeSecretKey, stripeApiVersion } from '@/lib/stripe/config';

let stripeSingleton: Stripe | null = null;

export function getStripeServerClient() {
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(getStripeSecretKey(), {
      apiVersion: stripeApiVersion,
    });
  }

  return stripeSingleton;
}
