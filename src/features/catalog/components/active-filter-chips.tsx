import Link from 'next/link';

import type { CatalogFilterState } from '@/domain/catalog/discovery';
import { toSearchParams } from '@/domain/catalog/discovery';
import { formatLabel } from '@/domain/catalog/utils';
import type { ProductCategory } from '@/domain/catalog/models';

type ActiveFilterChipsProps = {
  filters: CatalogFilterState;
  categories: ProductCategory[];
};

type Chip = {
  label: string;
  href: string;
};

export function ActiveFilterChips({ filters, categories }: ActiveFilterChipsProps) {
  const chips = createChips(filters, categories);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link key={chip.href + chip.label} href={chip.href} className="rounded-full border border-brand-sage/35 bg-white px-3 py-1 text-xs text-brand-moss">
          {chip.label} ×
        </Link>
      ))}
      <Link href="/plants" className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-moss underline-offset-4 hover:underline">
        Clear all
      </Link>
    </div>
  );
}

function toHref(filters: CatalogFilterState) {
  const query = toSearchParams(filters).toString();
  return query ? `/plants?${query}` : '/plants';
}

function withoutArrayValue<T>(values: T[], value: T) {
  return values.filter((item) => item !== value);
}

function createChips(filters: CatalogFilterState, categories: ProductCategory[]): Chip[] {
  const chips: Chip[] = [];
  const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]));

  filters.categories.forEach((value) => {
    chips.push({
      label: `Category: ${categoryNameBySlug.get(value) ?? value}`,
      href: toHref({ ...filters, categories: withoutArrayValue(filters.categories, value) }),
    });
  });

  filters.sunlight.forEach((value) => {
    chips.push({
      label: `Light: ${formatLabel(value)}`,
      href: toHref({ ...filters, sunlight: withoutArrayValue(filters.sunlight, value) }),
    });
  });

  filters.watering.forEach((value) => {
    chips.push({
      label: `Water: ${formatLabel(value)}`,
      href: toHref({ ...filters, watering: withoutArrayValue(filters.watering, value) }),
    });
  });

  filters.difficulty.forEach((value) => {
    chips.push({
      label: `Difficulty: ${formatLabel(value)}`,
      href: toHref({ ...filters, difficulty: withoutArrayValue(filters.difficulty, value) }),
    });
  });

  filters.seasons.forEach((value) => {
    chips.push({
      label: `Season: ${formatLabel(value)}`,
      href: toHref({ ...filters, seasons: withoutArrayValue(filters.seasons, value) }),
    });
  });

  filters.colors.forEach((value) => {
    chips.push({
      label: `Color: ${formatLabel(value)}`,
      href: toHref({ ...filters, colors: withoutArrayValue(filters.colors, value) }),
    });
  });

  filters.badges.forEach((value) => {
    chips.push({
      label: `Badge: ${formatLabel(value)}`,
      href: toHref({ ...filters, badges: withoutArrayValue(filters.badges, value) }),
    });
  });

  if (filters.pollinatorFriendly) {
    chips.push({
      label: 'Pollinator-friendly',
      href: toHref({ ...filters, pollinatorFriendly: false }),
    });
  }

  if (filters.featured) {
    chips.push({
      label: 'Featured only',
      href: toHref({ ...filters, featured: false }),
    });
  }

  if (typeof filters.minPrice === 'number') {
    chips.push({
      label: `Min: $${filters.minPrice}`,
      href: toHref({ ...filters, minPrice: undefined }),
    });
  }

  if (typeof filters.maxPrice === 'number') {
    chips.push({
      label: `Max: $${filters.maxPrice}`,
      href: toHref({ ...filters, maxPrice: undefined }),
    });
  }

  return chips;
}
