import Link from 'next/link';
import type { ReactNode } from 'react';

import type { ProductCategory } from '@/domain/catalog/models';
import type { CatalogFilterState } from '@/domain/catalog/discovery';
import { CATALOG_FILTER_OPTIONS } from '@/domain/catalog/constants';
import { formatLabel } from '@/domain/catalog/utils';

type FilterPanelProps = {
  categories: ProductCategory[];
  filters: CatalogFilterState;
};

type FilterGroupProps = {
  title: string;
  children: ReactNode;
};

function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <fieldset className="space-y-3 border-t border-brand-sage/20 pt-4 first:border-t-0 first:pt-0">
      <legend className="text-sm font-semibold text-brand-moss">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

type CheckboxProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
};

function FilterCheckbox({ name, value, label, checked }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 text-sm text-brand-charcoal/85">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} className="h-4 w-4 rounded border-brand-sage/40 text-brand-moss focus:ring-brand-sage" />
      <span>{label}</span>
    </label>
  );
}

export function FilterPanel({ categories, filters }: FilterPanelProps) {
  return (
    <form method="get" className="space-y-5 rounded-2xl border border-brand-sage/20 bg-white p-5">
      <input type="hidden" name="sort" value={filters.sort} />
      <FilterGroup title="Category">
        {categories.map((category) => (
          <FilterCheckbox
            key={category.slug}
            name="category"
            value={category.slug}
            label={category.name}
            checked={filters.categories.includes(category.slug)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Sunlight">
        {CATALOG_FILTER_OPTIONS.sunlight.map((value) => (
          <FilterCheckbox key={value} name="sunlight" value={value} label={formatLabel(value)} checked={filters.sunlight.includes(value)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Watering">
        {['low', 'moderate', 'high'].map((value) => (
          <FilterCheckbox key={value} name="watering" value={value} label={formatLabel(value)} checked={filters.watering.includes(value as CatalogFilterState['watering'][number])} />
        ))}
      </FilterGroup>

      <FilterGroup title="Difficulty">
        {CATALOG_FILTER_OPTIONS.difficulties.map((value) => (
          <FilterCheckbox key={value} name="difficulty" value={value} label={formatLabel(value)} checked={filters.difficulty.includes(value)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Flowering season">
        {CATALOG_FILTER_OPTIONS.seasons.map((value) => (
          <FilterCheckbox key={value} name="season" value={value} label={formatLabel(value)} checked={filters.seasons.includes(value)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Color palette">
        {CATALOG_FILTER_OPTIONS.colors.map((value) => (
          <FilterCheckbox key={value} name="color" value={value} label={formatLabel(value)} checked={filters.colors.includes(value)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Merchandising">
        <FilterCheckbox name="badge" value="new_arrival" label="New arrivals" checked={filters.badges.includes('new_arrival')} />
        <FilterCheckbox name="badge" value="bestseller" label="Bestsellers" checked={filters.badges.includes('bestseller')} />
        <FilterCheckbox name="pollinator" value="1" label="Pollinator-friendly" checked={filters.pollinatorFriendly} />
        <FilterCheckbox name="featured" value="1" label="Featured plants" checked={filters.featured} />
      </FilterGroup>

      <FilterGroup title="Price range">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs uppercase tracking-[0.12em] text-brand-charcoal/60">
            Min
            <input
              type="number"
              min={0}
              name="minPrice"
              defaultValue={filters.minPrice}
              className="mt-1 h-10 w-full rounded-lg border border-brand-sage/30 px-3 text-sm text-brand-charcoal"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-brand-charcoal/60">
            Max
            <input
              type="number"
              min={0}
              name="maxPrice"
              defaultValue={filters.maxPrice}
              className="mt-1 h-10 w-full rounded-lg border border-brand-sage/30 px-3 text-sm text-brand-charcoal"
            />
          </label>
        </div>
      </FilterGroup>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-brand-moss px-5 text-sm font-semibold text-brand-cream">
          Apply filters
        </button>
        <Link href="/plants" className="inline-flex h-10 items-center justify-center rounded-full border border-brand-sage/40 px-5 text-sm font-semibold text-brand-moss">
          Reset
        </Link>
      </div>
    </form>
  );
}
