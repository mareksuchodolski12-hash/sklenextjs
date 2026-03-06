import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PlantDiscoveryExperience } from '@/features/discovery/components/plant-discovery-experience';

import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Plant Discovery Studio',
  description:
    'Swipe-inspired discovery flow for finding premium garden flowers by mood, effect, and growing traits.',
  pathname: '/discovery',
});

export default function DiscoveryPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <PlantDiscoveryExperience />
      </Container>
    </section>
  );
}
