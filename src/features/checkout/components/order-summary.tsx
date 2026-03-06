import { formatPrice } from '@/domain/catalog/utils';
import { calculateOrderTotals, mockCheckoutItems } from '@/features/checkout/validation';

export function OrderSummary() {
  const totals = calculateOrderTotals(mockCheckoutItems);

  return (
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
        Payment and order creation are intentionally not enabled yet. This checkout securely captures
        details and prepares the payload for upcoming payment integration.
      </p>
    </section>
  );
}
