export type DiscoveryPlant = {
  id: string;
  name: string;
  price: number;
  image: {
    src: string;
    alt: string;
  };
  appeal: string;
  traits: {
    light: 'Sun' | 'Partial shade' | 'Shade';
    bloom: string;
    care: 'Easy care' | 'Moderate care';
    pollinatorFriendly: boolean;
  };
  moods: string[];
  effects: string[];
};

export const discoveryPlants: DiscoveryPlant[] = [
  {
    id: 'disc-dahlia-cafe-au-lait',
    name: 'Dahlia Café au Lait',
    price: 36,
    image: {
      src: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
      alt: 'Soft blush dahlia bloom in a premium garden arrangement',
    },
    appeal: 'Creates a romantic focal point with layered petals in café and blush tones.',
    traits: {
      light: 'Sun',
      bloom: 'Summer to early autumn',
      care: 'Moderate care',
      pollinatorFriendly: true,
    },
    moods: ['Romantic', 'Curated', 'Lush'],
    effects: ['Statement bloom', 'Cut flower quality'],
  },
  {
    id: 'disc-gaura-whirling',
    name: 'Gaura Whirling Butterflies',
    price: 24,
    image: {
      src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
      alt: 'Airy white flowers moving in warm breeze',
    },
    appeal: 'Delivers airy movement and a light, contemporary meadow character.',
    traits: {
      light: 'Sun',
      bloom: 'Late spring through autumn',
      care: 'Easy care',
      pollinatorFriendly: true,
    },
    moods: ['Light', 'Naturalistic', 'Modern'],
    effects: ['Soft movement', 'Pollinator activity'],
  },
  {
    id: 'disc-hellebore-ivory-prince',
    name: 'Hellebore Ivory Prince',
    price: 31,
    image: {
      src: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80',
      alt: 'Cream hellebore flowers in a shaded border',
    },
    appeal: 'Elegant winter-to-spring flowers for refined, low-light corners.',
    traits: {
      light: 'Partial shade',
      bloom: 'Late winter to spring',
      care: 'Easy care',
      pollinatorFriendly: true,
    },
    moods: ['Calm', 'Refined', 'Woodland'],
    effects: ['Shade interest', 'Early season color'],
  },
  {
    id: 'disc-nepeta-walkers-low',
    name: "Nepeta Walker's Low",
    price: 23,
    image: {
      src: 'https://images.unsplash.com/photo-1627413547392-1f5f58f3d824?auto=format&fit=crop&w=1200&q=80',
      alt: 'Blue-violet nepeta edging a gravel path',
    },
    appeal: 'Builds generous violet drifts that soften pathways and terraces.',
    traits: {
      light: 'Sun',
      bloom: 'Late spring to autumn',
      care: 'Easy care',
      pollinatorFriendly: true,
    },
    moods: ['Relaxed', 'Mediterranean', 'Welcoming'],
    effects: ['Long flowering', 'Pathway softening'],
  },
  {
    id: 'disc-astilbe-rheinland',
    name: 'Astilbe Rheinland',
    price: 28,
    image: {
      src: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80',
      alt: 'Feathery pink astilbe plumes in a shaded garden bed',
    },
    appeal: 'Adds plush plume texture and layered pink tones in cooler spots.',
    traits: {
      light: 'Shade',
      bloom: 'Early to midsummer',
      care: 'Moderate care',
      pollinatorFriendly: false,
    },
    moods: ['Romantic', 'Cool', 'Textural'],
    effects: ['Shade texture', 'Elegant color echo'],
  },
];
