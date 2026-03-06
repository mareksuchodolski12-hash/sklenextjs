import type { ReactNode } from 'react';

import { Container } from '@/components/layout/container';
import { cn } from '@/lib/utils';

type PageSectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

export function PageSection({ id, className, containerClassName, children }: PageSectionProps) {
  return (
    <section id={id} className={cn('py-14 sm:py-20', className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
