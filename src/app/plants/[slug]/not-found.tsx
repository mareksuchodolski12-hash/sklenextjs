import Link from 'next/link';

import { Container } from '@/components/layout/container';

export default function PlantNotFoundPage() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-3xl border border-brand-sage/20 bg-white px-6 py-14 text-center shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Plant not found</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-moss">
            This plant is no longer in our curated catalog
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-brand-charcoal/80 sm:text-base">
            The product may have moved or the seasonal batch is unavailable. Browse our full plant
            collection to discover similar premium options.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/plants"
              className="rounded-full bg-brand-moss px-6 py-3 text-sm font-semibold text-brand-cream"
            >
              Browse all plants
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
