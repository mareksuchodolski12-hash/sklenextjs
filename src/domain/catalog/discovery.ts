import { CATALOG_FILTER_OPTIONS } from './constants';
import type {
  ColorTone,
  FloweringSeason,
  MerchandisingBadge,
  Product,
  ProductCategory,
  ProductDifficulty,
  StockStatus,
  SunlightRequirement,
  WateringLevel,
} from './models';

export type CatalogSort = 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'alphabetical';

export type CatalogFilterState = {
  categories: ProductCategory['slug'][];
  sunlight: SunlightRequirement[];
  watering: WateringLevel[];
  difficulty: ProductDifficulty[];
  seasons: FloweringSeason[];
  colors: ColorTone[];
  pollinatorFriendly: boolean;
  featured: boolean;
  badges: MerchandisingBadge[];
  minPrice?: number;
  maxPrice?: number;
  sort: CatalogSort;
};

export const CATALOG_SORT_OPTIONS: Array<{ value: CatalogSort; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

const DEFAULT_FILTER_STATE: CatalogFilterState = {
  categories: [],
  sunlight: [],
  watering: [],
  difficulty: [],
  seasons: [],
  colors: [],
  pollinatorFriendly: false,
  featured: false,
  badges: [],
  sort: 'featured',
};

type SearchParamInput = Record<string, string | string[] | undefined>;

function asArray(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function onlyAllowed<T extends string>(input: string[], allowedValues: readonly T[]): T[] {
  const allowed = new Set(allowedValues);
  return [...new Set(input)].filter((value): value is T => allowed.has(value as T));
}

function asBoolean(value: string | string[] | undefined) {
  return value === '1' || value === 'true';
}

function asNumber(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
}

export function parseCatalogSearchParams(searchParams: SearchParamInput, availableCategories: ProductCategory['slug'][]): CatalogFilterState {
  const sortValue = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
  const sort = CATALOG_SORT_OPTIONS.some((option) => option.value === sortValue)
    ? (sortValue as CatalogSort)
    : DEFAULT_FILTER_STATE.sort;

  return {
    categories: onlyAllowed(asArray(searchParams.category), availableCategories),
    sunlight: onlyAllowed(asArray(searchParams.sunlight), CATALOG_FILTER_OPTIONS.sunlight),
    watering: onlyAllowed(asArray(searchParams.watering), ['low', 'moderate', 'high']),
    difficulty: onlyAllowed(asArray(searchParams.difficulty), CATALOG_FILTER_OPTIONS.difficulties),
    seasons: onlyAllowed(asArray(searchParams.season), CATALOG_FILTER_OPTIONS.seasons),
    colors: onlyAllowed(asArray(searchParams.color), CATALOG_FILTER_OPTIONS.colors),
    pollinatorFriendly: asBoolean(searchParams.pollinator),
    featured: asBoolean(searchParams.featured),
    badges: onlyAllowed(asArray(searchParams.badge), ['new_arrival', 'bestseller']),
    minPrice: asNumber(searchParams.minPrice),
    maxPrice: asNumber(searchParams.maxPrice),
    sort,
  };
}

export function applyCatalogFilters(products: Product[], filters: CatalogFilterState) {
  return products.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    if (filters.sunlight.length > 0 && !filters.sunlight.includes(product.sunlight)) {
      return false;
    }

    if (filters.watering.length > 0 && !filters.watering.includes(product.watering)) {
      return false;
    }

    if (filters.difficulty.length > 0 && !filters.difficulty.includes(product.difficulty)) {
      return false;
    }

    if (filters.seasons.length > 0 && !product.floweringSeasons.some((season) => filters.seasons.includes(season))) {
      return false;
    }

    if (filters.colors.length > 0 && !product.colorPalette.some((color) => filters.colors.includes(color))) {
      return false;
    }

    if (filters.pollinatorFriendly && !product.pollinatorFriendly) {
      return false;
    }

    if (filters.featured && !product.featured) {
      return false;
    }

    if (filters.badges.length > 0 && !product.badges.some((badge) => filters.badges.includes(badge))) {
      return false;
    }

    if (typeof filters.minPrice === 'number' && product.price < filters.minPrice) {
      return false;
    }

    if (typeof filters.maxPrice === 'number' && product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
}

const stockOrder: Record<StockStatus, number> = {
  in_stock: 0,
  low_stock: 1,
  preorder: 2,
  out_of_stock: 3,
};

export function sortCatalogProducts(products: Product[], sort: CatalogSort) {
  const sorted = [...products];

  if (sort === 'price_asc') {
    return sorted.sort((a, b) => a.price - b.price);
  }

  if (sort === 'price_desc') {
    return sorted.sort((a, b) => b.price - a.price);
  }

  if (sort === 'alphabetical') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === 'newest') {
    return sorted.sort((a, b) => Number(b.badges.includes('new_arrival')) - Number(a.badges.includes('new_arrival')));
  }

  return sorted.sort((a, b) => {
    const featuredDiff = Number(b.featured) - Number(a.featured);
    if (featuredDiff !== 0) {
      return featuredDiff;
    }

    const badgeDiff = Number(b.badges.includes('bestseller')) - Number(a.badges.includes('bestseller'));
    if (badgeDiff !== 0) {
      return badgeDiff;
    }

    return stockOrder[a.stockStatus] - stockOrder[b.stockStatus];
  });
}

export function hasActiveFilters(filters: CatalogFilterState) {
  return (
    filters.categories.length > 0 ||
    filters.sunlight.length > 0 ||
    filters.watering.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.seasons.length > 0 ||
    filters.colors.length > 0 ||
    filters.pollinatorFriendly ||
    filters.featured ||
    filters.badges.length > 0 ||
    typeof filters.minPrice === 'number' ||
    typeof filters.maxPrice === 'number'
  );
}

export function toSearchParams(filters: CatalogFilterState) {
  const params = new URLSearchParams();

  filters.categories.forEach((value) => params.append('category', value));
  filters.sunlight.forEach((value) => params.append('sunlight', value));
  filters.watering.forEach((value) => params.append('watering', value));
  filters.difficulty.forEach((value) => params.append('difficulty', value));
  filters.seasons.forEach((value) => params.append('season', value));
  filters.colors.forEach((value) => params.append('color', value));
  filters.badges.forEach((value) => params.append('badge', value));

  if (filters.pollinatorFriendly) {
    params.set('pollinator', '1');
  }

  if (filters.featured) {
    params.set('featured', '1');
  }

  if (typeof filters.minPrice === 'number') {
    params.set('minPrice', String(filters.minPrice));
  }

  if (typeof filters.maxPrice === 'number') {
    params.set('maxPrice', String(filters.maxPrice));
  }

  if (filters.sort !== DEFAULT_FILTER_STATE.sort) {
    params.set('sort', filters.sort);
  }

  return params;
}
