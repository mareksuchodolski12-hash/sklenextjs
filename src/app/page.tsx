import { getFeaturedProducts } from '@/data/mock/catalog-queries';
import { BrowseMoodsSection } from '@/features/home/sections/browse-moods-section';
import { BrowseNeedsSection } from '@/features/home/sections/browse-needs-section';
import { FeaturedCategoriesSection } from '@/features/home/sections/featured-categories-section';
import { FeaturedProductsSection } from '@/features/home/sections/featured-products-section';
import { HeroSection } from '@/features/home/sections/hero-section';
import { NewsletterSection } from '@/features/home/sections/newsletter-section';
import { SeasonalInspirationSection } from '@/features/home/sections/seasonal-inspiration-section';
import { TrustSection } from '@/features/home/sections/trust-section';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <>
      <HeroSection />
      <FeaturedCategoriesSection />
      <BrowseMoodsSection />
      <BrowseNeedsSection />
      <FeaturedProductsSection products={featuredProducts} />
      <TrustSection />
      <SeasonalInspirationSection />
      <NewsletterSection />
    </>
  );
}
