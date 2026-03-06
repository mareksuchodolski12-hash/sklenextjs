import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import {
  hasActiveFilters,
  parseCatalogSearchParams,
  type CatalogFilterState,
} from '@/domain/catalog/discovery';
import { ActiveFilterChips } from '@/features/catalog/components/active-filter-chips';
import { FilterPanel } from '@/features/catalog/components/filter-panel';
import { ProductGrid } from '@/features/catalog/components/product-grid';
import { SortControls } from '@/features/catalog/components/sort-controls';
import { buildPageMetadata } from '@/lib/seo';
import { getCatalogCategories, getFilteredListingProducts } from '@/server/catalog/queries';

export const revalidate = 300;

type PlantsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PlantsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasSearchParams = Object.values(params).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === 'string' && value.length > 0;
  });

  return buildPageMetadata({
    title: 'Shop outdoor flowers and garden plants',
    description:
      'Discover premium garden flowers and outdoor plants by style, season, and practical growing needs.',
    pathname: '/plants',
    noIndex: hasSearchParams,
  });
}

export default async function PlantsPage({ searchParams }: PlantsPageProps) {
  const params = await searchParams;
  const categories = await getCatalogCategories();
  const filters = parseCatalogSearchParams(
    params,
    categories.map((category: { slug: string }) => category.slug),
  );

  const sorted = await getFilteredListingProducts(filters, filters.sort);

  return (
    <section className="py-12 sm:py-16">
      <Container className="space-y-8">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Product discovery</p>
          <h1 className="font-serif text-4xl text-brand-moss sm:text-5xl">
            Shop outdoor flowers and garden plants
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
            Browse by practical needs and visual mood to find plants that suit your space, light,
            and maintenance preferences.
          </p>
        </header>

        <div className="rounded-2xl border border-brand-sage/20 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-charcoal/75">
              <span className="font-semibold text-brand-moss">{sorted.length}</span> results
            </p>
            <SortControls filters={filters} />
          </div>
          {hasActiveFilters(filters) ? (
            <div className="mt-4 border-t border-brand-sage/20 pt-4">
              <ActiveFilterChips filters={filters} categories={categories} />
            </div>
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <div className="hidden lg:block">
              <FilterPanel categories={categories} filters={filters} />
            </div>
            <details className="rounded-2xl border border-brand-sage/20 bg-white p-4 lg:hidden">
              <summary className="cursor-pointer list-none text-sm font-semibold text-brand-moss">
                Filters & price range
              </summary>
              <div className="mt-4">
                <FilterPanel categories={categories} filters={filters} />
              </div>
            </details>
          </aside>

          <div>
            {sorted.length > 0 ? (
              <ProductGrid products={sorted} />
            ) : (
              <EmptyState filters={filters} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function EmptyState({ filters }: { filters: CatalogFilterState }) {
  return (
    <div className="rounded-2xl border border-brand-sage/20 bg-white px-6 py-14 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">No matches</p>
      <h2 className="mt-3 font-serif text-3xl text-brand-moss">
        No plants match the current filters
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-charcoal/75">
        Try broadening your criteria by removing a few filters or resetting the search to explore
        the full curated catalog.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/plants"
          className="rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream"
        >
          Reset all filters
        </Link>
        <Link
          href={filters.sort === 'featured' ? '/plants' : `/plants?sort=${filters.sort}`}
          className="rounded-full border border-brand-sage/35 px-5 py-2 text-sm font-semibold text-brand-moss"
        >
          Keep sort only
        </Link>
      </div>
    </div>
  );
}
