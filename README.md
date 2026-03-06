# Verdant Atelier Storefront

Production-minded Next.js baseline for a premium e-commerce experience focused on garden flowers and outdoor plants.

## Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- ESLint + Next.js rules
- Prettier + Tailwind class sorting plugin

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

### 3) Build for production

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

## Project Structure

```text
src/
  app/                  # App Router entrypoints and layouts
  components/           # Shared UI/layout components
  config/               # Application-level static configuration
  features/             # Feature modules (domain-oriented)
  lib/                  # Reusable utilities and server-side helpers
  styles/               # Global styles
  types/                # Shared TypeScript types
```

## Architecture Notes

- **App Router first**: all routing and shell composition lives in `src/app`.
- **Feature-oriented growth path**: page-level capabilities should be expanded from `src/features/*`.
- **Clear server/client boundaries**: initial implementation is server-rendered by default; add `'use client'` only when needed for interactive islands.
- **Design system posture**: layout primitives live under `src/components` to keep UI predictable.
- **Operational readiness**: strict TypeScript + linting + formatting provide baseline engineering quality.

## PostgreSQL + Prisma Readiness (without full implementation)

The codebase includes early database shape preparation in `src/lib/database.ts` and environment validation helpers in `src/lib/env.ts`.

### Recommended next steps

1. Add Prisma dependencies and initialize Prisma.
2. Create `prisma/schema.prisma` with PostgreSQL datasource using `DATABASE_URL`.
3. Add first domain models (`Product`, `Collection`, `Category`).
4. Introduce repository/service layer under `src/features/*` for data access isolation.
5. Add migration and seed workflow for deployment environments.

## Environment Variables

Create `.env.local` when needed:

```env
DATABASE_URL=postgresql://...
```

`DATABASE_URL` is validated in production through `src/lib/env.ts`.
