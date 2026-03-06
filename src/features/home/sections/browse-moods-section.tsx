import Link from 'next/link';

import { homeMoods } from '@/data/mock/home';
import { PageSection } from '@/shared/ui/page-section';
import { SectionHeading } from '@/shared/ui/section-heading';

export function BrowseMoodsSection() {
  return (
    <PageSection className="bg-white/60">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Browse by style"
          title="Find plants by garden mood"
          description="Build a coherent atmosphere across borders, terraces, and outdoor rooms with style-first exploration."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {homeMoods.map((mood) => (
            <Link
              key={mood.name}
              href={mood.href}
              className="group rounded-2xl border border-brand-sage/20 bg-brand-cream/70 p-6 transition hover:border-brand-sage/40 hover:bg-brand-cream"
            >
              <h3 className="font-serif text-2xl text-brand-moss">{mood.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75">{mood.description}</p>
              <p className="mt-5 text-sm font-semibold text-brand-moss">Browse mood</p>
            </Link>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
