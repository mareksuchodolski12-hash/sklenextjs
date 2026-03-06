import Image from 'next/image';

import type { Product } from '@/domain/catalog/models';

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const [hero, ...rest] = product.images;

  return (
    <section className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-sage/20 bg-brand-cream/40">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rest.map((image) => (
            <div
              key={image.src}
              className="relative aspect-square overflow-hidden rounded-2xl border border-brand-sage/20 bg-brand-cream/40"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 18vw, 48vw"
              />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
