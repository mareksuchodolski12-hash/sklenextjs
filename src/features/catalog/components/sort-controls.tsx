import Link from 'next/link';

import { CATALOG_SORT_OPTIONS, type CatalogFilterState, type CatalogSort, toSearchParams } from '@/domain/catalog/discovery';

type SortControlsProps = {
  filters: CatalogFilterState;
};

export function SortControls({ filters }: SortControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {CATALOG_SORT_OPTIONS.map((option) => {
        const href = getSortHref(filters, option.value);
        const active = filters.sort === option.value;

        return (
          <Link
            key={option.value}
            href={href}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              active
                ? 'bg-brand-moss text-brand-cream'
                : 'border border-brand-sage/30 text-brand-moss hover:border-brand-sage/60'
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

function getSortHref(filters: CatalogFilterState, sort: CatalogSort) {
  const nextFilters: CatalogFilterState = {
    ...filters,
    sort,
  };

  const params = toSearchParams(nextFilters);
  const query = params.toString();
  return query ? `/plants?${query}` : '/plants';
}
