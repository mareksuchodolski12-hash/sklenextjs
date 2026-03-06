import nodemailer from 'nodemailer';

export type OrderConfirmationEmailItem = {
  description: string;
  quantity: number;
  amountTotalMinor: number | null;
  currency: string | null;
};

export type OrderConfirmationEmailPayload = {
  orderReference: string;
  customerEmail: string | null;
  currency: string | null;
  totalMinor: number | null;
  items: OrderConfirmationEmailItem[];
};

function formatCurrencyAmount(amountMinor: number | null, currency: string | null): string {
  if (amountMinor === null) {
    return 'n/a';
  }

  const normalizedCurrency = currency?.toUpperCase();

  if (!normalizedCurrency) {
    return `${(amountMinor / 100).toFixed(2)} (currency unavailable)`;
  }

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: normalizedCurrency,
    }).format(amountMinor / 100);
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${normalizedCurrency}`;
  }
}

function buildOrderConfirmationText(payload: OrderConfirmationEmailPayload): string {
  const customerEmail = payload.customerEmail ?? 'Unavailable';
  const itemSummary =
    payload.items.length === 0
      ? '- No line items were returned by Stripe.'
      : payload.items
          .map((item) => {
            const itemTotal = formatCurrencyAmount(
              item.amountTotalMinor,
              item.currency ?? payload.currency,
            );
            return `- ${item.description} × ${item.quantity} — ${itemTotal}`;
          })
          .join('\n');

  return [
    'Thank you for your order.',
    '',
    `Order reference: ${payload.orderReference}`,
    `Customer email: ${customerEmail}`,
    `Total: ${formatCurrencyAmount(payload.totalMinor, payload.currency)}`,
    '',
    'Purchased items:',
    itemSummary,
  ].join('\n');
}

export async function sendOrderConfirmationEmail(payload: OrderConfirmationEmailPayload): Promise<void> {
  const emailServer = process.env.EMAIL_SERVER;
  const emailFrom = process.env.EMAIL_FROM;

  if (!payload.customerEmail) {
    console.info('[order-email] skipped confirmation email: missing customer email', {
      orderReference: payload.orderReference,
    });
    return;
  }

  if (!emailServer || !emailFrom) {
    console.info('[order-email] skipped confirmation email: email transport not configured', {
      orderReference: payload.orderReference,
      customerEmail: payload.customerEmail,
    });
    return;
  }

  const transport = nodemailer.createTransport(emailServer);
  const text = buildOrderConfirmationText(payload);

  await transport.sendMail({
    to: payload.customerEmail,
    from: emailFrom,
    subject: `Order confirmation ${payload.orderReference}`,
    text,
  });
}
