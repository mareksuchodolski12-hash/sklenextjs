export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';

export type ProductDifficulty = 'easy' | 'moderate' | 'advanced';

export type WateringLevel = 'low' | 'moderate' | 'high';

export type SunlightRequirement = 'full_sun' | 'partial_shade' | 'full_shade';

export type FloweringSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export type GardenStyle =
  | 'cottage'
  | 'contemporary'
  | 'mediterranean'
  | 'wildlife_friendly'
  | 'shade_garden'
  | 'minimalist';

export type GardenEffect =
  | 'fragrance'
  | 'cutting_garden'
  | 'pollinator_habitat'
  | 'structural_interest'
  | 'ground_cover'
  | 'focal_point';

export type ColorTone =
  | 'white'
  | 'cream'
  | 'pink'
  | 'purple'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'green'
  | 'silver';

export type MerchandisingBadge = 'new_arrival' | 'bestseller';

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductDimensions = {
  heightCm: number;
  spreadCm: number;
};

export type HardinessZone = {
  min: number;
  max: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type CatalogCollection = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categorySlug?: string;
  style?: GardenStyle;
  season?: FloweringSeason;
  productSlugs: string[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: ProductCategory['slug'];
  tags: string[];
  floweringSeasons: FloweringSeason[];
  sunlight: SunlightRequirement;
  watering: WateringLevel;
  difficulty: ProductDifficulty;
  dimensions: ProductDimensions;
  hardinessZone?: HardinessZone;
  colorPalette: ColorTone[];
  pollinatorFriendly: boolean;
  petSafe?: boolean;
  stockStatus: StockStatus;
  featured: boolean;
  badges: MerchandisingBadge[];
  styles: GardenStyle[];
  effects: GardenEffect[];
  plantingNotes?: string;
  careNotes: string[];
  idealPlacement: string[];
};

export type CatalogFilterOptions = {
  styles: GardenStyle[];
  seasons: FloweringSeason[];
  sunlight: SunlightRequirement[];
  difficulties: ProductDifficulty[];
  colors: ColorTone[];
  effects: GardenEffect[];
  stockStatuses: StockStatus[];
};
