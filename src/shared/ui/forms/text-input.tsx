import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, hasError, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-brand-charcoal shadow-sm outline-none transition placeholder:text-brand-charcoal/45 focus:ring-2',
        hasError
          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
          : 'border-brand-sage/25 focus:border-brand-sage focus:ring-brand-sage/25',
        className,
      )}
      {...props}
    />
  );
});
