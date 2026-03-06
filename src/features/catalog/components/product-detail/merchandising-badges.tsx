import type { Product } from '@/domain/catalog/models';
import { formatLabel } from '@/domain/catalog/utils';

type MerchandisingBadgesProps = {
  product: Product;
};

export function MerchandisingBadges({ product }: MerchandisingBadgesProps) {
  const badges = [
    ...product.badges.map((badge) => formatLabel(badge)),
    product.pollinatorFriendly ? 'Pollinator favorite' : null,
    product.petSafe ? 'Pet safe' : null,
  ].filter((badge): badge is string => Boolean(badge));

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-brand-sage/25 bg-brand-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-moss"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
