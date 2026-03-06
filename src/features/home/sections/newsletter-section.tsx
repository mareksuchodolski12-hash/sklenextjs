import { PageSection } from '@/shared/ui/page-section';

export function NewsletterSection() {
  return (
    <PageSection>
      <div className="rounded-3xl border border-brand-sage/20 bg-white p-8 shadow-soft sm:p-12">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Garden journal</p>
          <h2 className="font-serif text-3xl text-brand-moss sm:text-4xl">Seasonal planting ideas, straight to your inbox</h2>
          <p className="text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            Get thoughtful monthly edits: what to plant now, design-forward combinations, and practical care notes from our horticulture team.
          </p>
          <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row" action="#" method="post">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-brand-sage/35 bg-brand-cream/60 px-5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/50 focus:border-brand-moss focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-brand-moss px-6 text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </PageSection>
  );
}
