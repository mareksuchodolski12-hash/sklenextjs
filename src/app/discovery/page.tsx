import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PlantDiscoveryExperience } from '@/features/discovery/components/plant-discovery-experience';

export const metadata: Metadata = {
  title: 'Plant Discovery Studio | Verdant Atelier',
  description:
    'Swipe-inspired discovery flow for finding premium garden flowers by mood, effect, and growing traits.',
};

export default function DiscoveryPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <PlantDiscoveryExperience />
      </Container>
    </section>
  );
}
