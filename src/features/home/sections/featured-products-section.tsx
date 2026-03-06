import Link from 'next/link';

import type { Product } from '@/domain/catalog/models';
import { ProductCard } from '@/features/catalog/components/product-card';
import { PageSection } from '@/shared/ui/page-section';
import { SectionHeading } from '@/shared/ui/section-heading';

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <PageSection id="featured-products" className="bg-white/70">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Featured products"
          title="Plants selected for beauty and performance"
          description="A rotating edit of standout varieties chosen for design impact, healthy growth habits, and seasonal longevity."
          action={
            <Link href="#" className="text-sm font-semibold text-brand-moss underline-offset-4 hover:underline">
              Shop all plants
            </Link>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}
