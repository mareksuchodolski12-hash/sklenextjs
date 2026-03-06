export type ProductImageField = {
  id: string;
  url: string;
  alt: string;
  position: number;
  isPrimary: boolean;
};

export type ProductEditorInitialData = {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  isActive: boolean;
  featured: boolean;
  quantityOnHand: number;
  trackInventory: boolean;
  collectionIds: string[];
  images: ProductImageField[];
};

export type TaxonomyOption = {
  id: string;
  label: string;
};
