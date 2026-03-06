# Verdant Atelier Storefront

Production-minded Next.js baseline for a premium e-commerce experience focused on garden flowers and outdoor plants.

## Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- ESLint + Next.js rules
- Prettier + Tailwind class sorting plugin

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env.local` and adjust `DATABASE_URL`:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/verdant_atelier?schema=public"
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
