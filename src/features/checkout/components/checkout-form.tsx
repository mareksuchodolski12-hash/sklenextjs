'use client';

import { type FormEvent, useMemo, useState } from 'react';

import type { CheckoutFormValues, CheckoutValidationErrors } from '@/features/checkout/types';
# codex/implement-checkout-foundation-for-flower-store-hu07kk
import type { CreateCheckoutSessionResponse } from '@/features/checkout/stripe-types';
#
# main
import {
  buildDraftOrderPayload,
  calculateOrderTotals,
  defaultAddress,
  mockCheckoutItems,
  validateCheckoutForm,
} from '@/features/checkout/validation';
import { formatPrice } from '@/domain/catalog/utils';
import { FormField } from '@/shared/ui/forms/form-field';
import { SelectInput } from '@/shared/ui/forms/select-input';
import { TextInput } from '@/shared/ui/forms/text-input';
import { TextareaInput } from '@/shared/ui/forms/textarea-input';

const initialValues: CheckoutFormValues = {
  email: '',
  phone: '',
  newsletterOptIn: false,
  shippingAddress: { ...defaultAddress },
  deliveryMethod: 'home_delivery',
  deliveryDate: '',
  deliveryNotes: '',
  billingSameAsShipping: true,
  billingAddress: { ...defaultAddress },
  gardeningNote: '',
};

export function CheckoutForm() {
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [errors, setErrors] = useState<CheckoutValidationErrors>({});
# codex/implement-checkout-foundation-for-flower-store-hu07kk
#
  const [submittedPayloadPreview, setSubmittedPayloadPreview] = useState<string | null>(null);
# main

  const totals = useMemo(() => calculateOrderTotals(mockCheckoutItems), []);

  const updateShippingField = (
    field: keyof CheckoutFormValues['shippingAddress'],
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));
  };

  const updateBillingField = (field: keyof CheckoutFormValues['billingAddress'], value: string) => {
    setValues((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }));
  };

# codex/implement-checkout-foundation-for-flower-store-hu07kk
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
#
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
# main
    event.preventDefault();
    const nextErrors = validateCheckoutForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
# codex/implement-checkout-foundation-for-flower-store-hu07kk
      return;
    }

    try {
      const draftOrder = buildDraftOrderPayload(values, mockCheckoutItems);
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ draftOrder }),
      });

      const payload = (await response.json()) as CreateCheckoutSessionResponse;

      if (!response.ok || !payload.ok) {
        return;
      }

      window.location.assign(payload.checkoutUrl);
    } catch {
      return;
    }
#
      setSubmittedPayloadPreview(null);
      return;
    }

    const payload = buildDraftOrderPayload(values, mockCheckoutItems);
    setSubmittedPayloadPreview(JSON.stringify(payload, null, 2));
# main
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <section className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">
            Customer information
          </p>
          <h2 className="mt-2 font-serif text-3xl text-brand-moss">Contact details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormField
              id="email"
              label="Email"
              required
              error={errors.email}
              className="sm:col-span-2"
            >
              <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
                hasError={Boolean(errors.email)}
                placeholder="you@example.com"
              />
            </FormField>
            <FormField id="phone" label="Phone" required error={errors.phone}>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
                hasError={Boolean(errors.phone)}
                placeholder="+44 7..."
              />
            </FormField>
            <label className="flex items-center gap-2 rounded-2xl border border-brand-sage/20 bg-brand-cream/55 px-4 py-3 text-sm text-brand-charcoal/80">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-brand-sage/40"
                checked={values.newsletterOptIn}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, newsletterOptIn: event.target.checked }))
                }
              />
              Send seasonal flower and planting inspiration.
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">Shipping & delivery</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-moss">Delivery details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FormField
              id="shipping-first-name"
              label="First name"
              required
              error={errors['shippingAddress.firstName']}
            >
              <TextInput
                id="shipping-first-name"
                autoComplete="shipping given-name"
                value={values.shippingAddress.firstName}
                onChange={(event) => updateShippingField('firstName', event.target.value)}
                hasError={Boolean(errors['shippingAddress.firstName'])}
              />
            </FormField>
            <FormField
              id="shipping-last-name"
              label="Last name"
              required
              error={errors['shippingAddress.lastName']}
            >
              <TextInput
                id="shipping-last-name"
                autoComplete="shipping family-name"
                value={values.shippingAddress.lastName}
                onChange={(event) => updateShippingField('lastName', event.target.value)}
                hasError={Boolean(errors['shippingAddress.lastName'])}
              />
            </FormField>
            <FormField id="shipping-company" label="Company (optional)">
              <TextInput
                id="shipping-company"
                autoComplete="shipping organization"
                value={values.shippingAddress.company}
                onChange={(event) => updateShippingField('company', event.target.value)}
              />
            </FormField>
            <FormField id="delivery-method" label="Delivery method" required>
              <SelectInput
                id="delivery-method"
                value={values.deliveryMethod}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    deliveryMethod: event.target.value as CheckoutFormValues['deliveryMethod'],
                  }))
                }
              >
                <option value="home_delivery">Home delivery</option>
                <option value="nursery_pickup">Nursery pickup</option>
              </SelectInput>
            </FormField>
            <FormField
              id="shipping-address-line-1"
              label="Address line 1"
              required
              error={errors['shippingAddress.addressLine1']}
              className="sm:col-span-2"
            >
              <TextInput
                id="shipping-address-line-1"
                autoComplete="shipping address-line1"
                value={values.shippingAddress.addressLine1}
                onChange={(event) => updateShippingField('addressLine1', event.target.value)}
                hasError={Boolean(errors['shippingAddress.addressLine1'])}
              />
            </FormField>
            <FormField
              id="shipping-address-line-2"
              label="Address line 2 (optional)"
              className="sm:col-span-2"
            >
              <TextInput
                id="shipping-address-line-2"
                autoComplete="shipping address-line2"
                value={values.shippingAddress.addressLine2}
                onChange={(event) => updateShippingField('addressLine2', event.target.value)}
              />
            </FormField>
            <FormField
              id="shipping-city"
              label="Town / city"
              required
              error={errors['shippingAddress.city']}
            >
              <TextInput
                id="shipping-city"
                autoComplete="shipping address-level2"
                value={values.shippingAddress.city}
                onChange={(event) => updateShippingField('city', event.target.value)}
                hasError={Boolean(errors['shippingAddress.city'])}
              />
            </FormField>
            <FormField
              id="shipping-region"
              label="County / region"
              required
              error={errors['shippingAddress.region']}
            >
              <TextInput
                id="shipping-region"
                autoComplete="shipping address-level1"
                value={values.shippingAddress.region}
                onChange={(event) => updateShippingField('region', event.target.value)}
                hasError={Boolean(errors['shippingAddress.region'])}
              />
            </FormField>
            <FormField
              id="shipping-postal"
              label="Postcode"
              required
              error={errors['shippingAddress.postalCode']}
            >
              <TextInput
                id="shipping-postal"
                autoComplete="shipping postal-code"
                value={values.shippingAddress.postalCode}
                onChange={(event) => updateShippingField('postalCode', event.target.value)}
                hasError={Boolean(errors['shippingAddress.postalCode'])}
              />
            </FormField>
            <FormField
              id="shipping-country"
              label="Country"
              required
              error={errors['shippingAddress.country']}
            >
              <TextInput
                id="shipping-country"
                autoComplete="shipping country-name"
                value={values.shippingAddress.country}
                onChange={(event) => updateShippingField('country', event.target.value)}
                hasError={Boolean(errors['shippingAddress.country'])}
              />
            </FormField>
            <FormField
              id="delivery-date"
              label="Preferred delivery date"
              required
              error={errors.deliveryDate}
            >
              <TextInput
                id="delivery-date"
                type="date"
                value={values.deliveryDate}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, deliveryDate: event.target.value }))
                }
                hasError={Boolean(errors.deliveryDate)}
              />
            </FormField>
            <FormField
              id="delivery-notes"
              label="Delivery notes"
              hint="Gate code, safe place, or any access details."
              className="sm:col-span-2"
            >
              <TextareaInput
                id="delivery-notes"
                rows={3}
                value={values.deliveryNotes}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, deliveryNotes: event.target.value }))
                }
                placeholder="e.g. Leave behind side gate near greenhouse."
              />
            </FormField>
            <FormField
              id="gardening-note"
              label="Garden planning note"
              hint="Optional: tell us how these flowers fit your scheme so advisors can help post-purchase."
              className="sm:col-span-2"
            >
              <TextareaInput
                id="gardening-note"
                rows={4}
                value={values.gardeningNote}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, gardeningNote: event.target.value }))
                }
                placeholder="e.g. Front border with morning sun, soft white and violet palette."
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">Billing</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-moss">Billing information</h2>

          <label className="mt-4 flex items-center gap-2 rounded-2xl border border-brand-sage/20 bg-brand-cream/55 px-4 py-3 text-sm text-brand-charcoal/85">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-brand-sage/40"
              checked={values.billingSameAsShipping}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, billingSameAsShipping: event.target.checked }))
              }
            />
            Billing address is the same as shipping address.
          </label>

          {!values.billingSameAsShipping ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField
                id="billing-first-name"
                label="First name"
                required
                error={errors['billingAddress.firstName']}
              >
                <TextInput
                  id="billing-first-name"
                  autoComplete="billing given-name"
                  value={values.billingAddress.firstName}
                  onChange={(event) => updateBillingField('firstName', event.target.value)}
                  hasError={Boolean(errors['billingAddress.firstName'])}
                />
              </FormField>
              <FormField
                id="billing-last-name"
                label="Last name"
                required
                error={errors['billingAddress.lastName']}
              >
                <TextInput
                  id="billing-last-name"
                  autoComplete="billing family-name"
                  value={values.billingAddress.lastName}
                  onChange={(event) => updateBillingField('lastName', event.target.value)}
                  hasError={Boolean(errors['billingAddress.lastName'])}
                />
              </FormField>
              <FormField
                id="billing-address-line-1"
                label="Address line 1"
                required
                error={errors['billingAddress.addressLine1']}
                className="sm:col-span-2"
              >
                <TextInput
                  id="billing-address-line-1"
                  autoComplete="billing address-line1"
                  value={values.billingAddress.addressLine1}
                  onChange={(event) => updateBillingField('addressLine1', event.target.value)}
                  hasError={Boolean(errors['billingAddress.addressLine1'])}
                />
              </FormField>
              <FormField
                id="billing-city"
                label="Town / city"
                required
                error={errors['billingAddress.city']}
              >
                <TextInput
                  id="billing-city"
                  autoComplete="billing address-level2"
                  value={values.billingAddress.city}
                  onChange={(event) => updateBillingField('city', event.target.value)}
                  hasError={Boolean(errors['billingAddress.city'])}
                />
              </FormField>
              <FormField
                id="billing-region"
                label="County / region"
                required
                error={errors['billingAddress.region']}
              >
                <TextInput
                  id="billing-region"
                  autoComplete="billing address-level1"
                  value={values.billingAddress.region}
                  onChange={(event) => updateBillingField('region', event.target.value)}
                  hasError={Boolean(errors['billingAddress.region'])}
                />
              </FormField>
              <FormField
                id="billing-postal"
                label="Postcode"
                required
                error={errors['billingAddress.postalCode']}
              >
                <TextInput
                  id="billing-postal"
                  autoComplete="billing postal-code"
                  value={values.billingAddress.postalCode}
                  onChange={(event) => updateBillingField('postalCode', event.target.value)}
                  hasError={Boolean(errors['billingAddress.postalCode'])}
                />
              </FormField>
              <FormField
                id="billing-country"
                label="Country"
                required
                error={errors['billingAddress.country']}
              >
                <TextInput
                  id="billing-country"
                  autoComplete="billing country-name"
                  value={values.billingAddress.country}
                  onChange={(event) => updateBillingField('country', event.target.value)}
                  hasError={Boolean(errors['billingAddress.country'])}
                />
              </FormField>
            </div>
          ) : null}
        </section>

        <button
          type="submit"
          className="w-full rounded-full bg-brand-moss px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand-cream transition hover:bg-brand-moss/95"
        >
# codex/implement-checkout-foundation-for-flower-store-hu07kk
          Continue to secure payment
#
          Continue to payment setup
# main
        </button>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <section className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">Order summary</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-moss">Your plants</h2>

          <ul className="mt-5 space-y-3">
            {mockCheckoutItems.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-brand-sage/20 bg-brand-cream/40 p-3 text-sm"
              >
                <p className="font-medium text-brand-charcoal">{item.name}</p>
                <p className="text-xs text-brand-charcoal/70">{item.variant}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-brand-charcoal/70">
                  <span>Qty {item.quantity}</span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-brand-sage/20 pt-4 text-sm">
            <div className="flex items-center justify-between text-brand-charcoal/75">
              <dt>Subtotal</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-brand-charcoal/75">
              <dt>Delivery</dt>
              <dd>{totals.delivery === 0 ? 'Included' : formatPrice(totals.delivery)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-brand-sage/20 pt-2 font-semibold text-brand-moss">
              <dt>Total</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>

          <p className="mt-4 rounded-2xl bg-brand-cream px-3 py-2 text-xs text-brand-charcoal/80">
# codex/implement-checkout-foundation-for-flower-store-hu07kk
            Secure payment is processed by Stripe. Fulfillment and order orchestration will be wired
            after webhook-driven order persistence is implemented.
          </p>
        </section>
#
            Payment processing and order creation hooks are intentionally not enabled yet.
          </p>
        </section>

        {submittedPayloadPreview ? (
          <section className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">
              Draft payload preview
            </p>
            <pre className="mt-3 max-h-72 overflow-auto rounded-2xl bg-brand-charcoal p-3 text-xs text-brand-cream">
              {submittedPayloadPreview}
            </pre>
          </section>
        ) : null}
# main
      </aside>
    </div>
  );
}
