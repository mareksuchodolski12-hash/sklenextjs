import type { NavigationItem } from '@/types';

export const siteConfig = {
  branding: {
    name: 'Verdant Atelier',
    tagline: 'Premium outdoor plant studio',
    description: 'Premium garden flowers and outdoor plants curated for modern outdoor living.',
  },
  url: 'https://verdant-atelier.example.com',
  metadata: {
    title: 'Verdant Atelier | Premium Garden Flowers & Plants',
    description:
      'Discover premium outdoor flowers and garden plants curated by style, season, and landscape effect.',
  },
  navigation: {
    main: [
      { label: 'Shop Plants', href: '/plants' },
      { label: 'Garden Styles', href: '#' },
      { label: 'Seasonal Inspiration', href: '#' },
      { label: 'Planting Guides', href: '#' },
    ] satisfies NavigationItem[],
    footer: {
      shop: [
        { label: 'All plants', href: '#' },
        { label: 'Featured collections', href: '#' },
        { label: 'New arrivals', href: '#' },
      ] satisfies NavigationItem[],
      explore: [
        { label: 'Garden moods', href: '#' },
        { label: 'Practical filters', href: '#' },
        { label: 'Seasonal journal', href: '#' },
      ] satisfies NavigationItem[],
      company: [
        { label: 'Our standards', href: '#' },
        { label: 'Delivery', href: '#' },
        { label: 'Contact', href: '#' },
      ] satisfies NavigationItem[],
    },
  },
  social: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
  },
};

export type SiteConfig = typeof siteConfig;
