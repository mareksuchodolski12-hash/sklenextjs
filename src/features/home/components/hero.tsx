import Link from 'next/link';

import { Container } from '@/components/layout/container';

export function HomeHero() {
  return (
    <section className="bg-brand-radial py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl space-y-8">
          <p className="text-sm uppercase tracking-[0.18em] text-brand-sage">Premium outdoor plant studio</p>
          <h1 className="font-serif text-4xl leading-tight text-brand-moss sm:text-5xl md:text-6xl">
            Curated flowers and plants for sophisticated gardens.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-brand-charcoal/80 sm:text-lg">
            Verdant Atelier delivers seasonal blooms, sculptural greenery, and refined outdoor accents designed to transform patios, terraces, and private landscapes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="#" className="inline-flex items-center justify-center rounded-full bg-brand-moss px-6 py-3 text-sm font-semibold text-brand-cream shadow-soft transition hover:bg-brand-charcoal">
              Explore Signature Collection
            </Link>
            <Link href="#" className="inline-flex items-center justify-center rounded-full border border-brand-sage/40 px-6 py-3 text-sm font-semibold text-brand-moss transition hover:border-brand-sage hover:bg-brand-sage/10">
              Learn Our Approach
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
