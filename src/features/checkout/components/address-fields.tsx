import type { CheckoutAddress, CheckoutValidationErrors } from '@/features/checkout/types';
import { FormField } from '@/shared/ui/forms/form-field';
import { TextInput } from '@/shared/ui/forms/text-input';

type AddressScope = 'shippingAddress' | 'billingAddress';

type AddressFieldsProps = {
  scope: AddressScope;
  values: CheckoutAddress;
  errors: CheckoutValidationErrors;
  onChange: (field: keyof CheckoutAddress, value: string) => void;
};

export function AddressFields({ scope, values, errors, onChange }: AddressFieldsProps) {
  const fieldError = (field: keyof CheckoutAddress) => {
    if (field === 'company' || field === 'addressLine2') {
      return undefined;
    }

    return errors[`${scope}.${field}` as keyof CheckoutValidationErrors];
  };
  const prefix = scope === 'shippingAddress' ? 'shipping' : 'billing';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField id={`${scope}-first-name`} label="First name" required error={fieldError('firstName')}>
        <TextInput
          id={`${scope}-first-name`}
          autoComplete={`${prefix} given-name`}
          hasError={Boolean(fieldError('firstName'))}
          value={values.firstName}
          onChange={(event) => onChange('firstName', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-last-name`} label="Last name" required error={fieldError('lastName')}>
        <TextInput
          id={`${scope}-last-name`}
          autoComplete={`${prefix} family-name`}
          hasError={Boolean(fieldError('lastName'))}
          value={values.lastName}
          onChange={(event) => onChange('lastName', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-company`} label="Company (optional)">
        <TextInput
          id={`${scope}-company`}
          autoComplete={`${prefix} organization`}
          value={values.company}
          onChange={(event) => onChange('company', event.target.value)}
        />
      </FormField>
      <div className="hidden sm:block" />
      <FormField
        id={`${scope}-address-line-1`}
        label="Address line 1"
        required
        error={fieldError('addressLine1')}
        className="sm:col-span-2"
      >
        <TextInput
          id={`${scope}-address-line-1`}
          autoComplete={`${prefix} address-line1`}
          hasError={Boolean(fieldError('addressLine1'))}
          value={values.addressLine1}
          onChange={(event) => onChange('addressLine1', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-address-line-2`} label="Address line 2 (optional)" className="sm:col-span-2">
        <TextInput
          id={`${scope}-address-line-2`}
          autoComplete={`${prefix} address-line2`}
          value={values.addressLine2}
          onChange={(event) => onChange('addressLine2', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-city`} label="Town / city" required error={fieldError('city')}>
        <TextInput
          id={`${scope}-city`}
          autoComplete={`${prefix} address-level2`}
          hasError={Boolean(fieldError('city'))}
          value={values.city}
          onChange={(event) => onChange('city', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-region`} label="County / region" required error={fieldError('region')}>
        <TextInput
          id={`${scope}-region`}
          autoComplete={`${prefix} address-level1`}
          hasError={Boolean(fieldError('region'))}
          value={values.region}
          onChange={(event) => onChange('region', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-postal`} label="Postcode" required error={fieldError('postalCode')}>
        <TextInput
          id={`${scope}-postal`}
          autoComplete={`${prefix} postal-code`}
          hasError={Boolean(fieldError('postalCode'))}
          value={values.postalCode}
          onChange={(event) => onChange('postalCode', event.target.value)}
        />
      </FormField>
      <FormField id={`${scope}-country`} label="Country" required error={fieldError('country')}>
        <TextInput
          id={`${scope}-country`}
          autoComplete={`${prefix} country-name`}
          hasError={Boolean(fieldError('country'))}
          value={values.country}
          onChange={(event) => onChange('country', event.target.value)}
        />
      </FormField>
    </div>
  );
}
