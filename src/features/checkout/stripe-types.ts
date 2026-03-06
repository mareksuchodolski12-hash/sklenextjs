import type { CheckoutDraftOrder } from '@/features/checkout/types';

export type CreateCheckoutSessionRequest = {
  draftOrder: CheckoutDraftOrder;
};

export type CreateCheckoutSessionResponse =
  | {
      ok: true;
      checkoutUrl: string;
      sessionId: string;
    }
  | {
      ok: false;
      code: 'BAD_REQUEST' | 'INVALID_CART' | 'CONFIG_ERROR' | 'STRIPE_ERROR' | 'UNKNOWN_ERROR';
      message: string;
    };
