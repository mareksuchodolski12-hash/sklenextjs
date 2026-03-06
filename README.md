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

```bash
cp .env.example .env.local
```

### 3) Start development server

```bash
npm run dev
```

### 4) Build for production

```bash
npm run build
npm run start
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

## Prisma + PostgreSQL setup

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Create and apply migrations

```bash
npm run prisma:migrate:dev -- --name init_catalog
```

### Seed catalog data from existing mocks

```bash
npm run db:seed
```

## Prisma schema coverage

The schema is designed to support premium storefront merchandising, filtering, related products, and stock-aware commerce while deferring auth, payments, and full order implementation.

Included models:

- `Product`
- `ProductImage`
- `Category`
- `Collection`
- `Tag`
- `CollectionProduct` (ordered collection membership)
- `ProductTag`
- `ProductAttribute` (optional extensible key/value fields)
- `ProductRelation` (related-product graph)
- `SavedDiscovery` (optional persisted discovery sessions/results)

## Project Structure

```text
prisma/
  schema.prisma          # PostgreSQL datasource + production-minded catalog schema
  seed.ts                # Seed strategy using current mock catalog data
src/
  app/                   # App Router entrypoints and layouts
  components/            # Shared UI/layout components
  config/                # Application-level static configuration
  features/              # Feature modules (domain-oriented)
  lib/
    database.ts          # Database provider/env key config
    env.ts               # Runtime environment validation helpers
    prisma.ts            # Prisma client singleton helper
  styles/                # Global styles
  types/                 # Shared TypeScript types
```

## Environment Variables

Create `.env.local` when needed:

```env
DATABASE_URL=postgresql://...
```

`DATABASE_URL` is validated in production through `src/lib/env.ts`.
