import Link from 'next/link';

import { homeNeeds } from '@/data/mock/home';
import { PageSection } from '@/shared/ui/page-section';
import { SectionHeading } from '@/shared/ui/section-heading';

export function BrowseNeedsSection() {
  return (
    <PageSection id="browse-needs">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Practical filters"
          title="Shop by real gardening needs"
          description="Quickly narrow the catalog by sunlight, maintenance level, and garden outcomes that matter in real life."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeNeeds.map((need) => (
            <Link
              key={need.name}
              href={need.href}
              className="rounded-2xl border border-brand-sage/20 bg-white p-5 transition hover:border-brand-sage/40"
            >
              <h3 className="text-lg font-semibold text-brand-moss">{need.name}</h3>
              <p className="mt-2 text-sm text-brand-charcoal/75">{need.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
