import Link from 'next/link';

import { seasonalStories } from '@/data/mock/home';
import { PageSection } from '@/shared/ui/page-section';
import { SectionHeading } from '@/shared/ui/section-heading';

export function SeasonalInspirationSection() {
  return (
    <PageSection className="bg-brand-moss text-brand-cream">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Seasonal inspiration"
          title="Plan your garden through the year"
          description="Editorial planting ideas designed to keep your outdoor space expressive and balanced in every season."
          className="[&_*]:text-brand-cream [&_p]:text-brand-cream/80"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {seasonalStories.map((story) => (
            <article key={story.title} className="rounded-2xl border border-brand-cream/20 bg-brand-cream/5 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-cream/70">{story.season}</p>
              <h3 className="mt-3 font-serif text-2xl">{story.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-cream/80">{story.description}</p>
              <Link href={story.href} className="mt-5 inline-flex text-sm font-semibold underline-offset-4 hover:underline">
                Read inspiration
              </Link>
            </article>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
