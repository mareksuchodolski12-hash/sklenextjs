import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { CheckoutForm } from '@/features/checkout/components/checkout-form';

export const metadata: Metadata = {
  title: 'Checkout | Verdant Atelier',
  description: 'Complete your premium garden flower order details and continue to secure Stripe checkout.',
};

export default function CheckoutPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
            Secure Stripe checkout
          </p>
          <h1 className="font-serif text-4xl text-brand-moss sm:text-5xl">Checkout</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            Confirm your contact and delivery details for a smooth, low-friction ordering flow.
            You will review your details here, then continue to Stripe for secure card payment.
          </p>
          <Link
            href="/plants"
            className="inline-flex text-sm font-semibold text-brand-moss underline-offset-4 hover:underline"
          >
            Continue browsing plants
          </Link>
        </div>

        <CheckoutForm />
      </Container>
    </section>
  );
}
