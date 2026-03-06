import type { Metadata } from 'next';

import { getFeaturedProducts } from '@/server/catalog/queries';
import { getHomeCategories } from '@/server/home/queries';
import { BrowseMoodsSection } from '@/features/home/sections/browse-moods-section';
import { BrowseNeedsSection } from '@/features/home/sections/browse-needs-section';
import { FeaturedCategoriesSection } from '@/features/home/sections/featured-categories-section';
import { FeaturedProductsSection } from '@/features/home/sections/featured-products-section';
import { HeroSection } from '@/features/home/sections/hero-section';
import { NewsletterSection } from '@/features/home/sections/newsletter-section';
import { SeasonalInspirationSection } from '@/features/home/sections/seasonal-inspiration-section';
import { TrustSection } from '@/features/home/sections/trust-section';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Premium garden flowers and outdoor plants',
  description:
    'Discover premium outdoor flowers and garden plants curated by style, season, and practical growing needs.',
  pathname: '/',
});

export default async function HomePage() {
  const [featuredProducts, homeCategories] = await Promise.all([
    getFeaturedProducts(4),
    getHomeCategories(),
  ]);

  return (
    <>
      <HeroSection />
      <FeaturedCategoriesSection categories={homeCategories} />
      <BrowseMoodsSection />
      <BrowseNeedsSection />
      <FeaturedProductsSection products={featuredProducts} />
      <TrustSection />
      <SeasonalInspirationSection />
      <NewsletterSection />
    </>
  );
}
