'use client';

import Link from 'next/link';

import { Container } from '@/components/layout/container';

export default function PlantsPageError() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="rounded-3xl border border-brand-sage/20 bg-white px-6 py-12 text-center shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">Catalog unavailable</p>
          <h1 className="mt-3 font-serif text-3xl text-brand-moss sm:text-4xl">
            We’re having trouble loading plants right now
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            Please refresh the page in a moment, or return to the homepage while we recover the
            catalog feed.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/plants"
              className="rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream"
            >
              Try again
            </Link>
            <Link
              href="/"
              className="rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-moss"
            >
              Go home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
