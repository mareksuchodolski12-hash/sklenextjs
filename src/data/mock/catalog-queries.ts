import { mockCollections, mockProducts } from './catalog';

export function getFeaturedProducts() {
  return mockProducts.filter((product) => product.featured);
}

export function getProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 3) {
  const product = getProductBySlug(slug);
  if (!product) {
    return [];
  }

  const related = mockProducts
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => {
      let score = 0;

      if (candidate.category === product.category) {
        score += 2;
      }

      score += candidate.styles.filter((style) => product.styles.includes(style)).length;
      score += candidate.effects.filter((effect) => product.effects.includes(effect)).length;

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  return related.slice(0, limit).map((entry) => entry.candidate);
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
