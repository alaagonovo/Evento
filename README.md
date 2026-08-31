# Evento

Marketplace for booking event services worldwide (weddings, engagements, birthdays, and general events). Customers browse wedding vendor specialties; vendors manage offerings, availability, and bookings; admins approve vendors.

## Stack

- Next.js App Router (TypeScript) + Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage, RLS, Realtime) — wired in step 2
- react-hook-form + Zod
- Vitest (unit) + Playwright (e2e)
- Vercel

Arabic RTL is the default locale (`/ar`). English lives at `/en`.

## Modules

Each domain lives under `src/modules/<name>/` with `components/`, `hooks/`, `services/`, `types/`, and a public `index.ts`.

**Rule:** app code and other modules import only from `@/modules/<name>`. Never from a nested file inside another module.

| Module | Responsibility |
|---|---|
| `auth` | Sign up, login, session |
| `users` | Profiles and roles (customer / vendor / admin) |
| `vendors` | Shared vendor browse, detail, and base types |
| `venues` | Date-based halls / event spaces |
| `photographers` | Package-based photography |
| `planners` | Planning packages |
| `makeup-artists` | Services + optional trials |
| `catering` | Per-person menus |
| `photo-locations` | Hourly locations |

Browse also lists florist, DJ, videography, wedding cake, transportation, and the other wedding specialties in `VENDOR_CATEGORY_SLUGS`. Dedicated modules land as those booking flows are built.

| `bookings` | Unified booking + conflict prevention |
| `reviews` | Ratings after completed bookings |
| `messaging` | Booking threads (Realtime) |
| `dashboard` | Customer / vendor / admin shells |
| `payments` | Paymob placeholder |
| `notifications` | Transactional email + `email_logs` |

`src/app/` stays thin: locale routing and page composition only.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required env vars in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, later admin/email jobs)

Auth confirmation and password-reset emails are sent by Supabase. Brand them as Evento with the HTML in `supabase/templates/` and custom SMTP (sender name `Evento`). See `supabase/templates/README.md`.

After pulling SQL changes, re-run `supabase/auth.sql` in the Supabase SQL editor so `email_exists` is available and `dev@gonovo.tech` is promoted to admin (the Auth user for that email must already exist). Run `supabase/vendor-categories.sql` so new vendor specialties exist on the `vendor_category` enum.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local app |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run test:coverage` | Vitest with coverage (services/hooks target: 70%) |
| `npm run test:e2e` | Playwright smoke tests |
| `npm run format` | Prettier |
| `npm run build` | Production build |

CI (GitHub Actions) runs lint → type-check → test → build on every pull request.

## Tests

- Unit: `src/**/*.test.ts` next to the code under test
- E2E: `e2e/` (full booking journeys land when bookings are implemented)

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
