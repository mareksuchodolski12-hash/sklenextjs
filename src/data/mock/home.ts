import type { HomeCategory, HomeMood, HomeNeed, SeasonalStory, TrustPoint } from '@/features/home/types/home';

export const homeCategories: HomeCategory[] = [
  {
    title: 'Flowering Perennials',
    eyebrow: 'Long-lived color',
    description: 'Reliable outdoor blooms that return every year with refined seasonal presence.',
    href: '#',
  },
  {
    title: 'Structural Plants',
    eyebrow: 'Modern form',
    description: 'Architectural foliage and grasses that create balance, movement, and shape.',
    href: '#',
  },
  {
    title: 'Pollinator-Friendly Picks',
    eyebrow: 'Wildlife support',
    description: 'High-value plants selected to attract bees, butterflies, and beneficial pollinators.',
    href: '#',
  },
];

export const homeMoods: HomeMood[] = [
  {
    name: 'Calm contemporary courtyard',
    description: 'Monochrome greens and sculptural silhouettes for composed outdoor living.',
    href: '#',
  },
  {
    name: 'Romantic cottage border',
    description: 'Soft seasonal succession and layered flower textures with effortless elegance.',
    href: '#',
  },
  {
    name: 'Mediterranean terrace',
    description: 'Sun-loving fragrance and silver foliage for warm, low-fuss planting schemes.',
    href: '#',
  },
  {
    name: 'Naturalistic pollinator garden',
    description: 'Dynamic meadow-inspired palettes designed for biodiversity and movement.',
    href: '#',
  },
];

export const homeNeeds: HomeNeed[] = [
  {
    name: 'Full sun performers',
    description: 'Heat-tolerant blooms for bright, exposed gardens.',
    href: '#',
  },
  {
    name: 'Shade-friendly planting',
    description: 'Lush texture and color for lower-light spaces.',
    href: '#',
  },
  {
    name: 'Easy-care choices',
    description: 'Low-maintenance plants for busy schedules.',
    href: '#',
  },
  {
    name: 'Pollinator magnets',
    description: 'Nectar-rich selections for bees and butterflies.',
    href: '#',
  },
  {
    name: 'Long blooming season',
    description: 'Extended color from spring through autumn.',
    href: '#',
  },
  {
    name: 'Container-ready',
    description: 'Compact varieties perfect for terraces and patios.',
    href: '#',
  },
];

export const trustPoints: TrustPoint[] = [
  {
    title: 'Horticulture-led curation',
    description: 'Every plant is selected for landscape performance, not just shelf appeal.',
  },
  {
    title: 'Premium grower network',
    description: 'Sourced from specialist growers known for healthy root systems and true-to-type cultivars.',
  },
  {
    title: 'Planting confidence',
    description: 'Clear care guidance by sunlight, season, and garden intent to help plants thrive.',
  },
];

export const seasonalStories: SeasonalStory[] = [
  {
    season: 'Spring',
    title: 'Fresh starts for layered borders',
    description: 'Early flowering anchors and foliage contrasts that set your garden up for the year.',
    href: '#',
  },
  {
    season: 'Summer',
    title: 'High season color and scent',
    description: 'Long-flowering combinations for entertaining terraces and sunny pathways.',
    href: '#',
  },
  {
    season: 'Autumn',
    title: 'Structure, seed heads, and warm tones',
    description: 'Late-season performers that keep gardens elegant as temperatures cool.',
    href: '#',
  },
];
