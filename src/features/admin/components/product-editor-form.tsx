'use client';

import { useMemo, useState } from 'react';

import type { ProductEditorInitialData, TaxonomyOption } from '@/features/admin/types';
import { FormField } from '@/shared/ui/forms/form-field';
import { SelectInput } from '@/shared/ui/forms/select-input';
import { TextInput } from '@/shared/ui/forms/text-input';
import { TextareaInput } from '@/shared/ui/forms/textarea-input';

type ProductEditorFormProps = {
  mode: 'create' | 'edit';
  initialData: ProductEditorInitialData;
  categories: TaxonomyOption[];
  collections: TaxonomyOption[];
};

export function ProductEditorForm({
  mode,
  initialData,
  categories,
  collections,
}: ProductEditorFormProps) {
  const [state, setState] = useState(initialData);

  const heading = useMemo(
    () => (mode === 'create' ? 'Create product foundation' : 'Edit product foundation'),
    [mode],
  );

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <section className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
        <h2 className="font-serif text-2xl text-brand-moss">{heading}</h2>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          This form is intentionally foundation-only. Wire server actions + schema validation in the
          next step.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField id="name" label="Product name" required>
            <TextInput
              id="name"
              value={state.name}
              onChange={(event) => setState((prev) => ({ ...prev, name: event.target.value }))}
            />
          </FormField>
          <FormField id="slug" label="Slug" required>
            <TextInput
              id="slug"
              value={state.slug}
              onChange={(event) => setState((prev) => ({ ...prev, slug: event.target.value }))}
            />
          </FormField>
          <FormField id="sku" label="SKU" required>
            <TextInput
              id="sku"
              value={state.sku}
              onChange={(event) => setState((prev) => ({ ...prev, sku: event.target.value }))}
            />
          </FormField>
          <FormField id="category" label="Category" required>
            <SelectInput
              id="category"
              value={state.categoryId}
              onChange={(event) => setState((prev) => ({ ...prev, categoryId: event.target.value }))}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField id="price" label="Price" required>
            <TextInput
              id="price"
              value={state.price}
              onChange={(event) => setState((prev) => ({ ...prev, price: event.target.value }))}
            />
          </FormField>
          <FormField id="compare-at-price" label="Compare at price">
            <TextInput
              id="compare-at-price"
              value={state.compareAtPrice}
              onChange={(event) =>
                setState((prev) => ({ ...prev, compareAtPrice: event.target.value }))
              }
            />
          </FormField>
          <FormField id="short-description" label="Short description" required className="md:col-span-2">
            <TextareaInput
              id="short-description"
              rows={2}
              value={state.shortDescription}
              onChange={(event) =>
                setState((prev) => ({ ...prev, shortDescription: event.target.value }))
              }
            />
          </FormField>
          <FormField id="long-description" label="Long description" required className="md:col-span-2">
            <TextareaInput
              id="long-description"
              rows={5}
              value={state.longDescription}
              onChange={(event) =>
                setState((prev) => ({ ...prev, longDescription: event.target.value }))
              }
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
        <h3 className="font-serif text-xl text-brand-moss">Collections and merchandising</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {collections.map((collection) => {
            const selected = state.collectionIds.includes(collection.id);
            return (
              <label
                key={collection.id}
                className="flex items-center gap-2 rounded-xl border border-brand-sage/20 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      collectionIds: event.target.checked
                        ? [...prev.collectionIds, collection.id]
                        : prev.collectionIds.filter((id) => id !== collection.id),
                    }));
                  }}
                />
                {collection.label}
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
        <h3 className="font-serif text-xl text-brand-moss">Images strategy</h3>
        <p className="mt-2 text-sm text-brand-charcoal/70">
          Current foundation uses URL-based image entries. A future upload provider should return
          persistent URLs (S3/Cloudinary/etc.) which can be inserted into these fields.
        </p>

        <div className="mt-4 space-y-3">
          {state.images.map((image, index) => (
            <div key={image.id} className="grid gap-3 rounded-xl border border-brand-sage/20 p-3 md:grid-cols-12">
              <div className="md:col-span-5">
                <FormField id={`image-url-${image.id}`} label={`Image ${index + 1} URL`} required>
                  <TextInput
                    id={`image-url-${image.id}`}
                    value={image.url}
                    onChange={(event) => {
                      const next = [...state.images];
                      next[index] = { ...next[index], url: event.target.value };
                      setState((prev) => ({ ...prev, images: next }));
                    }}
                  />
                </FormField>
              </div>
              <div className="md:col-span-4">
                <FormField id={`image-alt-${image.id}`} label="Alt text" required>
                  <TextInput
                    id={`image-alt-${image.id}`}
                    value={image.alt}
                    onChange={(event) => {
                      const next = [...state.images];
                      next[index] = { ...next[index], alt: event.target.value };
                      setState((prev) => ({ ...prev, images: next }));
                    }}
                  />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField id={`image-position-${image.id}`} label="Position">
                  <TextInput
                    id={`image-position-${image.id}`}
                    type="number"
                    value={image.position}
                    onChange={(event) => {
                      const next = [...state.images];
                      next[index] = { ...next[index], position: Number(event.target.value) || 0 };
                      setState((prev) => ({ ...prev, images: next }));
                    }}
                  />
                </FormField>
              </div>
              <div className="md:col-span-1 md:flex md:items-center md:pt-7">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={image.isPrimary}
                    onChange={(event) => {
                      const next = state.images.map((entry, entryIndex) => ({
                        ...entry,
                        isPrimary: entryIndex === index ? event.target.checked : false,
                      }));
                      setState((prev) => ({ ...prev, images: next }));
                    }}
                  />
                  Primary
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              images: [
                ...prev.images,
                {
                  id: `new-${Date.now()}`,
                  url: '',
                  alt: '',
                  position: prev.images.length,
                  isPrimary: false,
                },
              ],
            }))
          }
          className="mt-4 rounded-full border border-brand-sage/35 px-4 py-2 text-sm font-semibold text-brand-moss"
        >
          Add image row
        </button>
      </section>

      <div className="rounded-2xl border border-dashed border-brand-sage/30 bg-brand-cream/50 p-4 text-sm text-brand-charcoal/75">
        Save/publish actions are intentionally not wired yet. Next phase: server action + Zod schema +
        optimistic revalidation.
      </div>

      <button
        type="submit"
        className="rounded-full bg-brand-moss px-5 py-2 text-sm font-semibold text-brand-cream"
      >
        Save foundation draft
      </button>
    </form>
  );
}
