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

Create local environment variables from the provided template:

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` (and optionally `DIRECT_DATABASE_URL`) to your PostgreSQL instance.

### 3) Generate Prisma client

```bash
npm run prisma:generate
```

### 4) Create and apply migrations

```bash
npm run prisma:migrate:dev -- --name init_catalog
```

### 5) Seed starter catalog data

```bash
npm run db:seed
```

### 6) Start development server

```bash
npm run dev
```

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks
- `npm run format` — format project with Prettier
- `npm run format:check` — check formatting
- `npm run prisma:generate` — generate Prisma Client
- `npm run prisma:migrate:dev` — create + apply local migrations
- `npm run prisma:migrate:deploy` — apply migrations in deployment
- `npm run prisma:studio` — inspect data in Prisma Studio
- `npm run db:seed` — seed starter catalog data

## Prisma Data Model Overview

The Prisma schema is intentionally designed for production-oriented catalog growth while avoiding premature order/auth complexity.

### Core models

- `Product`: canonical commerce item with merchandising fields, stock controls, and horticultural filters.
- `ProductImage`: ordered media gallery per product.
- `Category`: primary navigational taxonomy.
- `Collection`: curated merchandising groups.
- `Tag`: flexible discoverability labels.

### Supporting models

- `CollectionProduct`: ordered many-to-many join between collections and products.
- `ProductTag`: many-to-many join between products and tags.
- `ProductAttribute`: key/value extension model to support future admin-managed custom attributes.
- `ProductRelation`: explicit related-product graph with optional score/reason metadata.
- `SavedDiscovery`: optional persistence for discovery quiz/search criteria and generated results.

### Notes on future expansion

- Inventory is represented directly on `Product` (`inventoryQuantity`, `lowStockThreshold`, `allowBackorder`, `trackInventory`, `stockStatus`).
- Orders, payments, and user authentication are intentionally deferred.
- The schema can later add `User`, `Address`, `Order`, and `OrderItem` without needing to redesign catalog primitives.

## Project Structure

```text
prisma/
  schema.prisma          # PostgreSQL datasource + production-minded catalog schema
  seed.ts                # Seeds catalog, collections, tags, and product relations from mock data
src/
  app/                   # App Router entrypoints and layouts
  components/            # Shared UI/layout components
  config/                # Application-level static configuration
  data/mock/             # Existing mock content used by seed script
  features/              # Feature modules (domain-oriented)
  lib/
    prisma.ts            # Prisma client singleton helper
    database.ts          # Database provider/env key config
    env.ts               # Runtime environment validation helpers
  styles/                # Global styles
  types/                 # Shared TypeScript types
```

## Environment Variables

```env
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...
```

- `DATABASE_URL` is required to connect Prisma to PostgreSQL.
- `DIRECT_DATABASE_URL` is optional but recommended for migration workflows in production.
