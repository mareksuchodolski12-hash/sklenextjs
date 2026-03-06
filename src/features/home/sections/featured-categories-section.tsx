import Link from 'next/link';

import { homeCategories } from '@/data/mock/home';
import { PageSection } from '@/shared/ui/page-section';
import { SectionHeading } from '@/shared/ui/section-heading';

export function FeaturedCategoriesSection() {
  return (
    <PageSection>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Categories"
          title="Start with what you want to grow"
          description="Our catalog focuses on outdoor flowers and garden plants selected for landscape intent, seasonality, and resilience."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {homeCategories.map((category) => (
            <article key={category.title} className="rounded-2xl border border-brand-sage/20 bg-white p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">{category.eyebrow}</p>
              <h3 className="mt-3 font-serif text-2xl text-brand-moss">{category.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75">{category.description}</p>
              <Link href={category.href} className="mt-5 inline-flex text-sm font-semibold text-brand-moss underline-offset-4 hover:underline">
                Explore category
              </Link>
            </article>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
