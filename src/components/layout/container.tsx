import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

type ContainerProps = {
  className?: string;
  children: ReactNode;
};

export function Container({ className, children }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}
