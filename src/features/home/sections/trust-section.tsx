import { trustPoints } from '@/data/mock/home';
import { PageSection } from '@/shared/ui/page-section';
import { SectionHeading } from '@/shared/ui/section-heading';

export function TrustSection() {
  return (
    <PageSection>
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Why Verdant Atelier"
          title="Premium quality without the guesswork"
          description="We combine design-led selection with practical horticultural guidance so every order supports a thriving outdoor space."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {trustPoints.map((point) => (
            <article key={point.title} className="rounded-2xl border border-brand-sage/20 bg-white p-6">
              <h3 className="font-serif text-2xl text-brand-moss">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75">{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
