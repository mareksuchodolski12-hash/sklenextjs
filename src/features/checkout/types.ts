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
    newsletterOptIn: boolean;
  };
  lines: CheckoutLineItem[];
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  delivery: {
    method: DeliveryMethod;
    preferredDate: string;
    deliveryNotes: string;
    gardeningNote: string;
  };
  checkoutState: {
    paymentStatus: 'pending_payment_setup';
    orderStatus: 'draft';
  };
};
