import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/container';
import type { Product } from '@/domain/catalog/models';
import { formatLabel, formatPrice, formatStockStatus } from '@/domain/catalog/utils';
import { ProductGrid } from '@/features/catalog/components/product-grid';
import { MerchandisingBadges } from '@/features/catalog/components/product-detail/merchandising-badges';
import { ProductFactsGrid } from '@/features/catalog/components/product-detail/product-facts-grid';
import { ProductGallery } from '@/features/catalog/components/product-detail/product-gallery';
import { ProductInfoList } from '@/features/catalog/components/product-detail/product-info-list';
import { buildPageMetadata, toAbsoluteUrl } from '@/lib/seo';
import { getCatalogProducts, getProductBySlug, getRelatedProducts } from '@/server/catalog/queries';

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product: { slug: string }) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildPageMetadata({
      title: 'Plant not found',
      description: 'The product you are looking for is unavailable or no longer listed.',
      pathname: `/plants/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: product.name,
    description: product.shortDescription,
    pathname: `/plants/${product.slug}`,
    image: product.images[0]?.src,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.slug, 3);

  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildProductStructuredData(product)),
          }}
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <ProductGallery product={product} />

          <div className="space-y-6 lg:pt-3">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
              Premium plant selection
            </p>
            <div className="space-y-3">
              <h1 className="font-serif text-4xl text-brand-moss sm:text-5xl">{product.name}</h1>
              <p className="text-sm leading-relaxed text-brand-charcoal/80 sm:text-base">
                {product.shortDescription}
              </p>
            </div>

            <MerchandisingBadges product={product} />

            <div className="rounded-3xl border border-brand-sage/25 bg-white p-5 shadow-soft">
              <p className="text-3xl font-semibold text-brand-moss">{formatPrice(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="mt-1 text-sm text-brand-charcoal/50 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              ) : null}
              <p className="mt-4 text-sm font-medium text-brand-charcoal/85">
                {getStockMessage(product)}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-brand-sage">
                Status: {formatStockStatus(product.stockStatus)}
              </p>
            </div>

            <div className="rounded-3xl bg-brand-moss p-6 text-brand-cream">
              <p className="text-xs uppercase tracking-[0.14em] text-brand-cream/80">
                Future-ready checkout area
              </p>
              <h2 className="mt-2 font-serif text-3xl">
                Reserve this plant for your next border refresh
              </h2>
              <p className="mt-3 text-sm text-brand-cream/85">
                Cart and checkout integration will plug in here next. For now, this call-to-action
                block is designed for seamless future wiring.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-full bg-brand-cream px-5 py-2 text-sm font-semibold text-brand-moss/70"
                >
                  Add to cart (coming soon)
                </button>
                <Link
                  href="/plants"
                  className="rounded-full border border-brand-cream/50 px-5 py-2 text-sm font-semibold text-brand-cream transition hover:bg-brand-cream/10"
                >
                  Explore more plants
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-sage/20 bg-brand-cream/50 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">Highlights</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-moss"
                  >
                    {formatLabel(tag.replace(/\s+/g, '_'))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ProductFactsGrid product={product} />

        <section className="rounded-3xl border border-brand-sage/20 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-serif text-3xl text-brand-moss">About this plant</h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-brand-charcoal/85 sm:text-base">
            {product.longDescription}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProductInfoList
            title="Care information"
            intro="Simple, practical guidance for confident growing."
            items={product.careNotes}
          />
          <ProductInfoList
            title="Ideal placement & garden use"
            intro="Where this plant performs best in premium, easy-to-manage planting plans."
            items={product.idealPlacement}
          />
        </div>

        {relatedProducts.length > 0 ? (
          <section className="space-y-5" aria-labelledby="related-plants-heading">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">
                  You might also like
                </p>
                <h2
                  id="related-plants-heading"
                  className="mt-2 font-serif text-3xl text-brand-moss"
                >
                  Similar plants for your scheme
                </h2>
              </div>
              <Link
                href="/plants"
                className="hidden text-sm font-semibold text-brand-moss underline-offset-4 hover:underline sm:inline"
              >
                View full collection
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        ) : (
          <section className="rounded-3xl border border-brand-sage/20 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-brand-moss">Explore more premium plants</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">
              We currently have no closely related matches for this product. Browse the full catalog
              to discover alternatives curated for style, resilience, and seasonality.
            </p>
            <Link
              href="/plants"
              className="mt-5 inline-flex rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream"
            >
              Browse all plants
            </Link>
          </section>
        )}
      </Container>
    </section>
  );
}

function getStockMessage(product: Product) {
  if (product.stockStatus === 'in_stock') {
    return 'Ready to plant now. Healthy nursery-grown stock available for immediate dispatch.';
  }

  if (product.stockStatus === 'low_stock') {
    return 'Limited nursery stock available. Recommended for immediate reservation.';
  }

  if (product.stockStatus === 'preorder') {
    return 'Next cultivation batch is opening soon. Join early access to secure delivery.';
  }

  return 'Currently unavailable while we prepare the next high-quality batch.';
}

function buildProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((image) => image.src),
    sku: product.id,
    category: product.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      url: toAbsoluteUrl(`/plants/${product.slug}`),
      availability: mapAvailability(product.stockStatus),
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

function mapAvailability(stockStatus: Product['stockStatus']) {
  if (stockStatus === 'in_stock' || stockStatus === 'low_stock') {
    return 'https://schema.org/InStock';
  }

  if (stockStatus === 'preorder') {
    return 'https://schema.org/PreOrder';
  }

  return 'https://schema.org/OutOfStock';
}
