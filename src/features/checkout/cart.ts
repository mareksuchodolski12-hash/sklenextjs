import type { CheckoutLineItem } from '@/features/checkout/types';

export const checkoutCartSeed: CheckoutLineItem[] = [
  {
    id: 'line-hydrangea-1',
    name: 'Hydrangea Paniculata Limelight',
    variant: '5L nursery pot',
    quantity: 2,
    unitPrice: 42,
  },
  {
    id: 'line-lavender-1',
    name: 'Lavandula Angustifolia Hidcote',
    variant: '2L premium rootball',
    quantity: 4,
    unitPrice: 14,
  },
];

export const stripeCatalogById = {
  'line-hydrangea-1': {
    name: 'Hydrangea Paniculata Limelight',
    description: '5L nursery pot',
    unitAmountMinor: 4200,
  },
  'line-lavender-1': {
    name: 'Lavandula Angustifolia Hidcote',
    description: '2L premium rootball',
    unitAmountMinor: 1400,
  },
} as const;

export type StripeCatalogItemId = keyof typeof stripeCatalogById;
