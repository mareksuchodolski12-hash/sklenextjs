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
