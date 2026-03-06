import Link from 'next/link';

import { Container } from '@/components/layout/container';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <section className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <div className="rounded-3xl border border-brand-sage/20 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Payment confirmed</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-moss">Thank you for your order</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            Your checkout has been successfully completed with Stripe. Order orchestration and
            post-payment fulfillment workflows are the next integration step.
          </p>

          {sessionId ? (
            <p className="mt-4 rounded-2xl bg-brand-cream px-4 py-3 text-xs text-brand-charcoal/80">
              Stripe session reference: <span className="font-medium">{sessionId}</span>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/plants"
              className="rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream"
            >
              Continue shopping
            </Link>
            <Link
              href="/account"
              className="rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-moss"
            >
              View account
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
