import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { siteConfig } from '@/config/site';

export function HeroSection() {
  return (
    <section className="bg-brand-radial pb-16 pt-14 sm:pb-24 sm:pt-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">{siteConfig.branding.tagline}</p>
            <h1 className="font-serif text-4xl leading-tight text-brand-moss sm:text-5xl lg:text-6xl">
              Premium outdoor flowers and plants for modern garden living.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-brand-charcoal/80 sm:text-lg">
              Discover curated plants by style, season, and practical growing needs—so your garden looks intentional and thrives year-round.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#featured-products"
                className="inline-flex items-center justify-center rounded-full bg-brand-moss px-6 py-3 text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal"
              >
                Shop featured plants
              </Link>
              <Link
                href="#browse-needs"
                className="inline-flex items-center justify-center rounded-full border border-brand-sage/35 px-6 py-3 text-sm font-semibold text-brand-moss transition hover:bg-brand-sage/10"
              >
                Browse by growing needs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-3xl bg-gradient-to-br from-brand-petal/80 to-brand-cream p-8 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-moss/70">Seasonal curation</p>
              <p className="mt-3 font-serif text-3xl text-brand-moss">Spring to autumn performance</p>
              <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75">
                Editor-selected plants that layer bloom windows, foliage, and structure into cohesive outdoor compositions.
              </p>
            </div>
            <div className="rounded-3xl border border-brand-sage/20 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-brand-sage">Garden style</p>
              <p className="mt-2 font-serif text-2xl text-brand-moss">Contemporary calm</p>
            </div>
            <div className="rounded-3xl border border-brand-sage/20 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-brand-sage">Plant quality</p>
              <p className="mt-2 font-serif text-2xl text-brand-moss">Grower-grade stock</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
