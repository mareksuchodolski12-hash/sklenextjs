import 'server-only';

import type {
  ColorTone,
  FloweringSeason,
  GardenEffect,
  GardenStyle,
  MerchandisingBadge,
  Product,
  ProductCategory,
  ProductDifficulty,
  StockStatus,
  SunlightRequirement,
  WateringLevel,
} from '@/domain/catalog/models';

type ProductAttributeRecord = {
  slug: string;
  valueText: string | null;
  valueNumber: { toNumber(): number } | null;
  valueBoolean: boolean | null;
};

type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number | { toNumber(): number };
  compareAtPrice: number | { toNumber(): number } | null;
  featured: boolean;
  stockStatus: string;
  minHardinessZone: number | null;
  maxHardinessZone: number | null;
  sunlight: string;
  watering: string;
  difficulty: string;
  floweringSeasons: string[];
  colorPalette: string[];
  styles: string[];
  effects: string[];
  category: {
    slug: string;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  tags: Array<{
    tag: {
      label: string;
      slug: string;
    };
  }>;
  attributes: ProductAttributeRecord[];
};

const FALLBACK_IMAGE = {
  src: '/images/catalog/placeholder-plant.jpg',
  alt: 'Plant placeholder image',
};

function toNumber(value: number | { toNumber(): number } | null | undefined): number | undefined {
  if (typeof value === 'number') {
    return value;
  }

  return value?.toNumber();
}

function toStringArray<T extends string>(values: string[] | null | undefined): T[] {
  return (values ?? []) as T[];
}

function parseBooleanAttribute(attributes: ProductAttributeRecord[], slug: string): boolean {
  return attributes.some(
    (attribute: ProductAttributeRecord) =>
      attribute.slug === slug &&
      (attribute.valueBoolean === true || attribute.valueText?.toLowerCase() === 'true'),
  );
}

function parseTextListAttribute(attributes: ProductAttributeRecord[], slug: string): string[] {
  const item = attributes.find((attribute: ProductAttributeRecord) => attribute.slug === slug);
  if (!item?.valueText) {
    return [];
  }

  return item.valueText
    .split('|')
    .map((value: string) => value.trim())
    .filter(Boolean);
}

function inferBadges(product: ProductRecord): MerchandisingBadge[] {
  const badges: MerchandisingBadge[] = [];
  if (product.featured) {
    badges.push('bestseller');
  }

  if (product.tags.some((entry) => entry.tag.slug.includes('new'))) {
    badges.push('new_arrival');
  }

  return badges;
}

export function mapCategoryToViewModel(category: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}): ProductCategory {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? '',
  };
}

export function mapProductToViewModel(product: ProductRecord): Product {
  const images = product.images.map((image) => ({ src: image.url, alt: image.alt }));

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    price: toNumber(product.price) ?? 0,
    compareAtPrice: toNumber(product.compareAtPrice),
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    category: product.category.slug,
    tags: product.tags.map((entry) => entry.tag.label),
    floweringSeasons: toStringArray<FloweringSeason>(product.floweringSeasons),
    sunlight: product.sunlight as SunlightRequirement,
    watering: product.watering as WateringLevel,
    difficulty: product.difficulty as ProductDifficulty,
    dimensions: {
      heightCm:
        product.attributes
          .find((attribute: ProductAttributeRecord) => attribute.slug === 'height_cm')
          ?.valueNumber?.toNumber() ?? 0,
      spreadCm:
        product.attributes
          .find((attribute: ProductAttributeRecord) => attribute.slug === 'spread_cm')
          ?.valueNumber?.toNumber() ?? 0,
    },
    hardinessZone:
      typeof product.minHardinessZone === 'number' && typeof product.maxHardinessZone === 'number'
        ? { min: product.minHardinessZone, max: product.maxHardinessZone }
        : undefined,
    colorPalette: toStringArray<ColorTone>(product.colorPalette),
    pollinatorFriendly:
      product.effects.includes('pollinator_habitat') ||
      parseBooleanAttribute(product.attributes, 'pollinator_friendly'),
    petSafe: parseBooleanAttribute(product.attributes, 'pet_safe') || undefined,
    stockStatus: product.stockStatus as StockStatus,
    featured: product.featured,
    badges: inferBadges(product),
    styles: toStringArray<GardenStyle>(product.styles),
    effects: toStringArray<GardenEffect>(product.effects),
    plantingNotes:
      product.attributes.find(
        (attribute: ProductAttributeRecord) => attribute.slug === 'planting_notes',
      )?.valueText ?? undefined,
    careNotes: parseTextListAttribute(product.attributes, 'care_notes'),
    idealPlacement: parseTextListAttribute(product.attributes, 'ideal_placement'),
  };
}
