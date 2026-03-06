'use client';

import { type FormEvent, useState } from 'react';

import { AddressFields } from '@/features/checkout/components/address-fields';
import { CheckoutSection } from '@/features/checkout/components/checkout-section';
import { OrderSummary } from '@/features/checkout/components/order-summary';
import type {
  CheckoutAddress,
  CheckoutFormValues,
  CheckoutValidationErrors,
} from '@/features/checkout/types';
import type { CreateCheckoutSessionResponse } from '@/features/checkout/stripe-types';
import {
  buildDraftOrderPayload,
  defaultCheckoutValues,
  mockCheckoutItems,
  validateCheckoutForm,
} from '@/features/checkout/validation';
import { FormField } from '@/shared/ui/forms/form-field';
import { SelectInput } from '@/shared/ui/forms/select-input';
import { TextInput } from '@/shared/ui/forms/text-input';
import { TextareaInput } from '@/shared/ui/forms/textarea-input';

export function CheckoutForm() {
  const [values, setValues] = useState<CheckoutFormValues>(defaultCheckoutValues);
  const [errors, setErrors] = useState<CheckoutValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateAddressField = (
    scope: 'shippingAddress' | 'billingAddress',
    field: keyof CheckoutAddress,
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

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
        setSubmitError(
          payload.ok ? 'We could not start secure checkout. Please try again.' : payload.message,
        );
        return;
      }

      window.location.assign(payload.checkoutUrl);
    } catch {
      setSubmitError('A network error occurred while starting Stripe checkout. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {submitError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {submitError}
          </div>
        ) : null}

        <CheckoutSection eyebrow="Customer information" title="Contact details">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="email"
              label="Email"
              required
              error={errors.email}
              className="sm:col-span-2"
            >
              <TextInput
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                hasError={Boolean(errors.email)}
                value={values.email}
                onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
              />
            </FormField>
            <FormField id="phone" label="Phone" required error={errors.phone}>
              <TextInput
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+44 7..."
                hasError={Boolean(errors.phone)}
                value={values.phone}
                onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
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
        </CheckoutSection>

        <CheckoutSection eyebrow="Shipping & delivery" title="Delivery details">
          <AddressFields
            scope="shippingAddress"
            values={values.shippingAddress}
            errors={errors}
            onChange={(field, value) => updateAddressField('shippingAddress', field, value)}
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              id="delivery-date"
              label="Preferred delivery date"
              required
              error={errors.deliveryDate}
            >
              <TextInput
                id="delivery-date"
                type="date"
                hasError={Boolean(errors.deliveryDate)}
                value={values.deliveryDate}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, deliveryDate: event.target.value }))
                }
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
                placeholder="e.g. Leave behind side gate near greenhouse."
                value={values.deliveryNotes}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, deliveryNotes: event.target.value }))
                }
              />
            </FormField>
            <FormField
              id="gardening-note"
              label="Garden planning note"
              hint="Optional: share planting context so advisors can support after purchase."
              className="sm:col-span-2"
            >
              <TextareaInput
                id="gardening-note"
                rows={4}
                placeholder="e.g. Front border with morning sun, soft white and violet palette."
                value={values.gardeningNote}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, gardeningNote: event.target.value }))
                }
              />
            </FormField>
          </div>
        </CheckoutSection>

        <CheckoutSection eyebrow="Billing" title="Billing information">
          <label className="flex items-center gap-2 rounded-2xl border border-brand-sage/20 bg-brand-cream/55 px-4 py-3 text-sm text-brand-charcoal/85">
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
            <div className="mt-5">
              <AddressFields
                scope="billingAddress"
                values={values.billingAddress}
                errors={errors}
                onChange={(field, value) => updateAddressField('billingAddress', field, value)}
              />
            </div>
          ) : null}
        </CheckoutSection>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-moss px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand-cream transition hover:bg-brand-moss/95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Starting secure payment…' : 'Continue to secure payment'}
        </button>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <OrderSummary />
      </aside>
    </div>
  );
}
