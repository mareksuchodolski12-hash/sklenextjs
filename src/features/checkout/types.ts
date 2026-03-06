export type CheckoutLineItem = {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
};

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type DeliveryMethod = 'home_delivery' | 'nursery_pickup';

export type CheckoutFormValues = {
  email: string;
  phone: string;
  newsletterOptIn: boolean;
  shippingAddress: CheckoutAddress;
  deliveryMethod: DeliveryMethod;
  deliveryDate: string;
  deliveryNotes: string;
  billingSameAsShipping: boolean;
  billingAddress: CheckoutAddress;
  gardeningNote: string;
};

export type CheckoutValidationErrors = Partial<
  Record<
    | 'email'
    | 'phone'
    | 'shippingAddress.firstName'
    | 'shippingAddress.lastName'
    | 'shippingAddress.addressLine1'
    | 'shippingAddress.city'
    | 'shippingAddress.region'
    | 'shippingAddress.postalCode'
    | 'shippingAddress.country'
    | 'deliveryDate'
    | 'billingAddress.firstName'
    | 'billingAddress.lastName'
    | 'billingAddress.addressLine1'
    | 'billingAddress.city'
    | 'billingAddress.region'
    | 'billingAddress.postalCode'
    | 'billingAddress.country',
    string
  >
>;

export type CheckoutDraftOrder = {
  customer: {
    email: string;
    phone: string;
  };
  lines: CheckoutLineItem[];
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  delivery: {
    method: DeliveryMethod;
    date: string;
    deliveryNotes: string;
    gardeningNote: string;
  };
};

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
