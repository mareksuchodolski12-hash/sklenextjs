import Image from 'next/image';
import Link from 'next/link';

import type { Product } from '@/domain/catalog/models';
import {
  formatDifficulty,
  formatLabel,
  formatPrice,
  formatProductHeightSpread,
  formatStockStatus,
  formatSunlight,
  formatWatering,
} from '@/domain/catalog/utils';

type ProductCardProps = {
  product: Product;
};

function getPaletteClass(color: Product['colorPalette'][number]) {
  const palette: Record<Product['colorPalette'][number], string> = {
    white: 'from-zinc-100 to-zinc-200',
    cream: 'from-amber-100 to-amber-200',
    pink: 'from-rose-100 to-pink-200',
    purple: 'from-violet-100 to-purple-200',
    blue: 'from-sky-100 to-blue-200',
    yellow: 'from-yellow-100 to-amber-200',
    orange: 'from-orange-100 to-orange-200',
    red: 'from-red-100 to-rose-200',
    green: 'from-emerald-100 to-green-200',
    silver: 'from-slate-100 to-slate-300',
  };

  return palette[color] ?? 'from-brand-petal/60 to-brand-cream';
}

export function ProductCard({ product }: ProductCardProps) {
  const accent = getPaletteClass(product.colorPalette[0] ?? 'green');
  const heroImage = product.images[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-sage/20 bg-white shadow-soft">
      <div className={`relative flex aspect-[4/3] items-end overflow-hidden p-4 ${accent}`}>
        {heroImage ? (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
          />
        ) : null}
        <div className="relative z-10 rounded-full bg-white/85 px-3 py-1 text-xs uppercase tracking-[0.12em] text-brand-moss">
          {product.floweringSeasons.map((season) => formatLabel(season)).join(' · ')}
        </div>
        {product.badges.length > 0 ? (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-brand-moss px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-cream">
            {formatLabel(product.badges[0])}
          </div>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">
            {formatStockStatus(product.stockStatus)}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-brand-moss">{product.name}</h3>
          <p className="mt-2 text-sm text-brand-charcoal/80">{product.shortDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-brand-charcoal/70">
          <p>Light: {formatSunlight(product.sunlight)}</p>
          <p>Water: {formatWatering(product.watering)}</p>
          <p>Difficulty: {formatDifficulty(product.difficulty)}</p>
          <p>{formatProductHeightSpread(product)}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-brand-moss">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-brand-charcoal/50 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <Link
            href={`/plants/${product.slug}`}
            className="rounded-full border border-brand-moss px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-moss transition hover:bg-brand-moss hover:text-brand-cream"
          >
            View plant
          </Link>
        </div>
      </div>
    </article>
  );
}
