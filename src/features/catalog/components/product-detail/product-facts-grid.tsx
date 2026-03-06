import type { Product } from '@/domain/catalog/models';
import {
  formatDifficulty,
  formatLabel,
  formatProductHeightSpread,
  formatRangeLabel,
  formatSeason,
  formatSunlight,
  formatWatering,
} from '@/domain/catalog/utils';

type ProductFactsGridProps = {
  product: Product;
};

export function ProductFactsGrid({ product }: ProductFactsGridProps) {
  const facts = [
    { label: 'Sunlight', value: formatSunlight(product.sunlight) },
    { label: 'Watering', value: formatWatering(product.watering) },
    {
      label: 'Flowering season',
      value: product.floweringSeasons.map((season) => formatSeason(season)).join(', '),
    },
    { label: 'Difficulty', value: formatDifficulty(product.difficulty) },
    { label: 'Mature size', value: formatProductHeightSpread(product) },
    {
      label: 'Color palette',
      value: product.colorPalette.map((tone) => formatLabel(tone)).join(', '),
    },
    { label: 'Pollinator friendly', value: product.pollinatorFriendly ? 'Yes' : 'No' },
    product.hardinessZone
      ? {
          label: 'Hardiness zone',
          value: formatRangeLabel(product.hardinessZone.min, product.hardinessZone.max, ''),
        }
      : null,
    product.plantingNotes ? { label: 'Planting notes', value: product.plantingNotes } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <section className="rounded-3xl border border-brand-sage/20 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="font-serif text-3xl text-brand-moss">Core plant facts</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-2xl bg-brand-cream/60 p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-brand-sage">{fact.label}</dt>
            <dd className="mt-2 text-sm text-brand-charcoal/85">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
