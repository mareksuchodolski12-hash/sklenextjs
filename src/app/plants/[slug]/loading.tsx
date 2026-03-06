import { Container } from '@/components/layout/container';

export default function ProductLoadingPage() {
  return (
    <section className="py-10 sm:py-14" aria-busy="true" aria-live="polite">
      <Container className="space-y-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="aspect-[4/5] animate-pulse rounded-3xl border border-brand-sage/20 bg-brand-cream/70" />
          <div className="space-y-4">
            <div className="h-3 w-36 animate-pulse rounded bg-brand-sage/20" />
            <div className="h-12 w-2/3 animate-pulse rounded bg-brand-sage/20" />
            <div className="h-4 w-full animate-pulse rounded bg-brand-sage/15" />
            <div className="h-36 animate-pulse rounded-3xl border border-brand-sage/20 bg-white" />
            <div className="h-44 animate-pulse rounded-3xl bg-brand-moss/20" />
          </div>
        </div>
      </Container>
    </section>
  );
}
