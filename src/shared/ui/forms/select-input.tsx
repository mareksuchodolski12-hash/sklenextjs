import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
  { className, hasError, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition focus:ring-2',
        hasError
          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
          : 'border-brand-sage/25 focus:border-brand-sage focus:ring-brand-sage/25',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
