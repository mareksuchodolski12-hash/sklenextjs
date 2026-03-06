import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl space-y-3">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">{eyebrow}</p> : null}
        <h2 className="font-serif text-3xl text-brand-moss sm:text-4xl">{title}</h2>
        {description ? <p className="text-sm leading-relaxed text-brand-charcoal/75 sm:text-base">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
