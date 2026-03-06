import Link from 'next/link';

import { Container } from '@/components/layout/container';

export default function CheckoutCancelPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <div className="rounded-3xl border border-brand-sage/20 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Checkout cancelled</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-moss">Payment was not completed</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            No payment was captured. You can review your details and continue when you are ready.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/checkout"
              className="rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream"
            >
              Return to checkout
            </Link>
            <Link
              href="/plants"
              className="rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-moss"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
