import { Container } from '@/components/layout/container';

export default function PlantsLoadingPage() {
  return (
    <section className="py-12 sm:py-16" aria-busy="true" aria-live="polite">
      <Container className="space-y-8">
        <div className="space-y-4">
          <div className="h-3 w-32 animate-pulse rounded bg-brand-sage/20" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-brand-sage/20" />
          <div className="h-4 w-full animate-pulse rounded bg-brand-sage/15" />
        </div>

        <div className="h-20 animate-pulse rounded-2xl border border-brand-sage/20 bg-white" />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl border border-brand-sage/20 bg-white"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
