import type {
  FloweringSeason,
  GardenEffect,
  GardenStyle,
  Product,
  ProductDifficulty,
  StockStatus,
  SunlightRequirement,
  WateringLevel,
} from './models';

const labelMap: Record<string, string> = {
  full_sun: 'Full sun',
  partial_shade: 'Partial shade',
  full_shade: 'Full shade',
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
  preorder: 'Pre-order',
  new_arrival: 'New arrival',
  bestseller: 'Bestseller',
  wildlife_friendly: 'Wildlife friendly',
  shade_garden: 'Shade garden',
  cutting_garden: 'Cutting garden',
  pollinator_habitat: 'Pollinator habitat',
  structural_interest: 'Structural interest',
  ground_cover: 'Ground cover',
  focal_point: 'Focal point',
};

export function formatPrice(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLabel(value: string) {
  if (labelMap[value]) {
    return labelMap[value];
  }

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatRangeLabel(min: number, max: number, suffix: string) {
  return `${min}–${max}${suffix}`;
}

export function formatProductHeightSpread(product: Product) {
  const { heightCm, spreadCm } = product.dimensions;
  return `H ${heightCm}cm × W ${spreadCm}cm`;
}

export function formatStockStatus(status: StockStatus) {
  return formatLabel(status);
}

export function formatSunlight(value: SunlightRequirement) {
  return formatLabel(value);
}

export function formatDifficulty(value: ProductDifficulty) {
  return formatLabel(value);
}

export function formatWatering(value: WateringLevel) {
  return formatLabel(value);
}

export function formatSeason(value: FloweringSeason) {
  return formatLabel(value);
}

export function formatGardenStyle(value: GardenStyle) {
  return formatLabel(value);
}

export function formatGardenEffect(value: GardenEffect) {
  return formatLabel(value);
}
