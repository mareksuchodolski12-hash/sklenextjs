import { mockCollections, mockProducts } from './catalog';

export function getFeaturedProducts() {
  return mockProducts.filter((product) => product.featured);
}

export function getCollectionBySlug(slug: string) {
  return mockCollections.find((collection) => collection.slug === slug);
}

export function getProductsBySlugs(slugs: string[]) {
  const slugSet = new Set(slugs);
  return mockProducts.filter((product) => slugSet.has(product.slug));
}

export function getHomeFeaturedCollections(slugs: string[]) {
  return slugs
    .map((slug) => {
      const collection = getCollectionBySlug(slug);
      if (!collection) {
        return null;
      }

      return {
        collection,
        products: getProductsBySlugs(collection.productSlugs),
      };
    })
    .filter((value): value is NonNullable<typeof value> => Boolean(value));
}
