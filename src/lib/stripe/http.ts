import { getStripeSecretKey } from '@/lib/stripe/config';

export type StripeCheckoutLineItem = {
  quantity: number;
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      description?: string;
    };
  };
};

export type StripeCheckoutSession = {
  id: string;
  url: string | null;
  payment_status?: string;
  customer_details?: {
    email?: string | null;
  } | null;
};

function encodeForm(data: Record<string, string>): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    params.append(key, value);
  }

  return params;
}

function buildCheckoutSessionForm(payload: {
  mode: 'payment';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  clientReferenceId: string;
  lineItems: StripeCheckoutLineItem[];
  metadata: Record<string, string>;
}) {
  const values: Record<string, string> = {
    mode: payload.mode,
    success_url: payload.successUrl,
    cancel_url: payload.cancelUrl,
    client_reference_id: payload.clientReferenceId,
    billing_address_collection: 'required',
    'shipping_address_collection[allowed_countries][0]': 'GB',
    'phone_number_collection[enabled]': 'true',
  };

  if (payload.customerEmail) {
    values.customer_email = payload.customerEmail;
  }

  payload.lineItems.forEach((lineItem, index) => {
    values[`line_items[${index}][quantity]`] = String(lineItem.quantity);
    values[`line_items[${index}][price_data][currency]`] = lineItem.price_data.currency;
    values[`line_items[${index}][price_data][unit_amount]`] = String(
      lineItem.price_data.unit_amount,
    );
    values[`line_items[${index}][price_data][product_data][name]`] =
      lineItem.price_data.product_data.name;

    if (lineItem.price_data.product_data.description) {
      values[`line_items[${index}][price_data][product_data][description]`] =
        lineItem.price_data.product_data.description;
    }
  });

  Object.entries(payload.metadata).forEach(([key, value]) => {
    values[`metadata[${key}]`] = value;
  });

  return encodeForm(values);
}

export async function createStripeCheckoutSession(payload: {
  mode: 'payment';
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  clientReferenceId: string;
  lineItems: StripeCheckoutLineItem[];
  metadata: Record<string, string>;
}): Promise<StripeCheckoutSession> {
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: buildCheckoutSessionForm(payload),
    cache: 'no-store',
  });

  const json = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const error = typeof json.error === 'object' && json.error ? json.error : null;
    const message =
      error && typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Stripe API request failed.';
    throw new Error(message);
  }

  return {
    id: String(json.id ?? ''),
    url: typeof json.url === 'string' ? json.url : null,
  };
}

export async function retrieveStripeCheckoutSession(
  sessionId: string,
): Promise<StripeCheckoutSession> {
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
    },
    cache: 'no-store',
  });

  const json = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const error = typeof json.error === 'object' && json.error ? json.error : null;
    const message =
      error && typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Stripe API request failed.';
    throw new Error(message);
  }

  return {
    id: String(json.id ?? ''),
    url: typeof json.url === 'string' ? json.url : null,
    payment_status: typeof json.payment_status === 'string' ? json.payment_status : undefined,
    customer_details:
      typeof json.customer_details === 'object' && json.customer_details
        ? {
            email:
              typeof (json.customer_details as { email?: unknown }).email === 'string'
                ? ((json.customer_details as { email: string }).email ?? null)
                : null,
          }
        : null,
  };
}
