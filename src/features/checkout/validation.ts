import type {
  CheckoutAddress,
  CheckoutDraftOrder,
  CheckoutFormValues,
  CheckoutLineItem,
  CheckoutValidationErrors,
} from './types';

export const defaultAddress: CheckoutAddress = {
  firstName: '',
  lastName: '',
  company: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'United Kingdom',
};

export const defaultCheckoutValues: CheckoutFormValues = {
  email: '',
  phone: '',
  newsletterOptIn: false,
  shippingAddress: defaultAddress,
  deliveryMethod: 'home_delivery',
  deliveryDate: '',
  deliveryNotes: '',
  billingSameAsShipping: true,
  billingAddress: defaultAddress,
  gardeningNote: '',
};

function validateAddress(
  address: CheckoutAddress,
  prefix: 'shippingAddress' | 'billingAddress',
  errors: CheckoutValidationErrors,
) {
  if (!address.firstName.trim()) errors[`${prefix}.firstName`] = 'First name is required';
  if (!address.lastName.trim()) errors[`${prefix}.lastName`] = 'Last name is required';
  if (!address.addressLine1.trim()) errors[`${prefix}.addressLine1`] = 'Address line is required';
  if (!address.city.trim()) errors[`${prefix}.city`] = 'Town or city is required';
  if (!address.region.trim()) errors[`${prefix}.region`] = 'Region is required';
  if (!address.postalCode.trim()) errors[`${prefix}.postalCode`] = 'Postcode is required';
  if (!address.country.trim()) errors[`${prefix}.country`] = 'Country is required';
}

export function validateCheckoutForm(values: CheckoutFormValues) {
  const errors: CheckoutValidationErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (values.phone.replace(/\D/g, '').length < 8) {
    errors.phone = 'Please enter a valid phone number';
  }

  validateAddress(values.shippingAddress, 'shippingAddress', errors);

  if (!values.deliveryDate.trim()) {
    errors.deliveryDate = 'Choose a preferred delivery or pickup date';
  }

  if (!values.billingSameAsShipping) {
    validateAddress(values.billingAddress, 'billingAddress', errors);
  }

  return errors;
}

export function buildDraftOrderPayload(
  values: CheckoutFormValues,
  lineItems: CheckoutLineItem[],
): CheckoutDraftOrder {
  return {
    customer: {
      email: values.email,
      phone: values.phone,
    },
    lines: lineItems,
    shippingAddress: values.shippingAddress,
    billingAddress: values.billingSameAsShipping ? values.shippingAddress : values.billingAddress,
    delivery: {
      method: values.deliveryMethod,
      date: values.deliveryDate,
      deliveryNotes: values.deliveryNotes,
      gardeningNote: values.gardeningNote,
    },
  };
}

export function calculateOrderTotals(items: CheckoutLineItem[]) {
  const subtotal = items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  const delivery = subtotal >= 120 ? 0 : 8;
  const total = subtotal + delivery;

  return { subtotal, delivery, total };
}
