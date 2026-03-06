# Verdant Atelier Storefront

Production-minded Next.js baseline for a premium e-commerce experience focused on garden flowers and outdoor plants.

## Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Auth.js (NextAuth) with Prisma adapter
- ESLint + Next.js rules
- Prettier + Tailwind class sorting plugin

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env.local` and configure database + auth secrets/providers:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/verdant_atelier?schema=public"
AUTH_SECRET="replace-with-strong-random-secret"

# choose at least one provider strategy
# GITHUB_ID=""
# GITHUB_SECRET=""
# EMAIL_SERVER="smtp://localhost:1025"
# EMAIL_FROM="Verdant Atelier <noreply@verdant-atelier.local>"

# admin route protection
ADMIN_EMAILS="owner@example.com"

# Stripe checkout configuration
STRIPE_SECRET_KEY="sk_test_replace_me"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_replace_me"
STRIPE_WEBHOOK_SECRET="whsec_replace_me"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SITE_URL="http://localhost:3000"
```

### 3) Generate Prisma Client

```bash
npm run prisma:generate
```

### 4) Run first migration (local development)

```bash
npm run prisma:migrate:dev -- --name init_catalog
```

### 5) Seed starter catalog data

```bash
npm run prisma:seed
```

### 6) Start development server

```bash
npm run dev
```

## Authentication

This storefront uses **Auth.js / NextAuth (App Router)** with a Prisma adapter.

### Provider strategy

- **Production-ready default**: GitHub OAuth and/or Email magic link (configure either or both via env vars).
- **Local fallback**: if no provider env vars are set in non-production, a development-only email credential flow is enabled so local auth remains usable.

### Auth routes and areas

- `/auth/sign-in` — sign-in surface for configured providers.
- `/api/auth/[...nextauth]` — Auth.js handler route.
- `/account` — protected account shell (middleware + server guard).

### Session approach

- Uses **database sessions** when OAuth/email providers are configured.
- Falls back to **JWT sessions** only for dev-credentials mode.
- Session exposes `session.user.id` for linking favorites/discoveries.

## Production migration flow

Use `prisma migrate deploy` in deployment pipelines:

```bash
npm run prisma:migrate:deploy
```

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks
- `npm run format` — format project with Prettier
- `npm run format:check` — check formatting
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate:dev` — create/apply local migration
- `npm run prisma:migrate:deploy` — apply committed migrations in production
- `npm run prisma:seed` — seed a starter merchandising catalog

## Prisma schema overview

`prisma/schema.prisma` introduces a production-minded catalog core:

- **Product** with inventory-aware fields (`quantityOnHand`, `quantityReserved`, `lowStockThreshold`, `allowBackorder`, `stockStatus`) and merchandising metadata (`featured`, `styles`, `effects`, seasonal/color arrays).
- **ProductImage** for ordered media and a primary image flag.
- **Category** and **Collection** for taxonomy and curated merchandising rails.
- **Tag** with `ProductTag` join model to support filtering and future admin editing.
- **ProductCollection** join model with `sortOrder` to control collection curation.
- **ProductRelation** self-relation to support related products / “pairs well with” suggestions.
- **ProductAttribute** flexible key/value strategy for future filter expansion and admin-managed specs.
- **SavedDiscovery** to persist quiz/discovery criteria/results for future user or session-based flows.

## Codebase integration

- `src/lib/prisma.ts` exposes a singleton Prisma Client suitable for Next.js server runtimes.
- `src/lib/database.ts` centralizes database provider and required URL helpers.
- `src/lib/env.ts` keeps production-time environment validation in place.
- `prisma/seed.mjs` seeds representative catalog data aligned with the current mock storefront direction.

## Project Structure

```text
prisma/
  schema.prisma          # Data model + datasource + generator
  seed.mjs               # Starter seed strategy
src/
  app/                   # App Router entrypoints and layouts
  components/            # Shared UI/layout components
  config/                # Application-level static configuration
  data/                  # Current mock-driven data sources
  features/              # Feature modules (domain-oriented)
  lib/                   # Reusable utilities and server-side helpers
  styles/                # Global styles
  types/                 # Shared TypeScript types
```

## Architecture Notes

- **Catalog-first schema**: enough depth for premium merchandising without locking into premature order/payment modeling.
- **Migration-ready foundation**: schema is explicit, relational, and ready for Prisma migrations.
- **Admin-friendly future**: slugs, join models, and attributes support non-destructive content editing patterns.
- **Growth path**: orders/users can be added later without rewriting catalog primitives.

## Stripe payment flow (App Router)

This project includes a production-minded Stripe checkout foundation:

- `POST /api/checkout/session` creates Stripe Checkout Sessions server-side.
- `/checkout` collects customer, delivery, and billing details before redirecting to Stripe.
- `/checkout/success` and `/checkout/cancel` provide return surfaces after Stripe flow completion.
- `POST /api/stripe/webhook` verifies Stripe signatures and provides a safe skeleton for order persistence.

### Security and architecture notes

- Stripe secret usage is server-only (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`).
- `SITE_URL` (or fallback `NEXT_PUBLIC_SITE_URL`) is used server-side for Stripe return URLs.
- Client never receives secret keys or computes authoritative payment amounts.
- Checkout session line items are mapped from a server-maintained catalog and sanitized quantities.
- Webhook route validates `stripe-signature` using Stripe SDK before processing events.

### Local webhook testing

1. Install Stripe CLI and authenticate.
2. Forward events to local webhook:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

> Note: webhook currently logs validated events and is intentionally a skeleton until order persistence is implemented.

### Manual Stripe setup checklist

1. Create/collect Stripe API keys in dashboard (test mode first).
2. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `SITE_URL` in environment.
3. Start webhook forwarding and set `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Run checkout from `/checkout` and complete payment with a Stripe test card (e.g. `4242 4242 4242 4242`).
5. Confirm redirect behavior:
   - success -> `/checkout/success?session_id=...`
   - cancel -> `/checkout/cancel`



## Admin area foundation

A production-minded admin shell is available under `/admin` with defense-in-depth protection:

- Middleware gate: authenticated users only on `/admin/*`, plus email allowlist enforcement via `ADMIN_EMAILS`.
- Server gate: admin layout uses a server-side `requireAdminSession()` guard so route checks are not only client/middleware dependent.
- Catalog foundation pages:
  - `/admin` dashboard summary
  - `/admin/products` list management
  - `/admin/products/new` create form foundation
  - `/admin/products/[id]` edit form foundation
  - `/admin/taxonomy` category/collection management shell

Image handling strategy is URL-first for now (upload-provider agnostic), preparing for a future storage integration (S3/Cloudinary/etc.) that returns durable URLs.
