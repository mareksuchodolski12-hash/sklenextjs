import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-brand-charcoal/85">
        {label}
        {required ? <span className="ml-1 text-brand-moss">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-brand-charcoal/60">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
    </div>
  );
}
