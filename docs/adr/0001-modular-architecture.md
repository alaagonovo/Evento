# ADR 0001: Modules over feature-sliced folders

## Status

Accepted

## Context

Evento covers seven vendor specialties, a shared booking engine, auth/roles, dashboards, reviews, messaging, payments, and notifications. A flat `features/` or page-centric folder layout would mix Supabase queries, UI, and types across domains and make it easy for venues code to depend on dresses internals.

## Decision

Each domain is a module with a fixed interior (`components`, `hooks`, `services`, `types`) and a single public API (`index.ts`).

- Pages in `src/app/` compose modules; they do not contain business logic or Supabase calls.
- Modules must not import another module's nested files — only `@/modules/<name>`.
- ESLint `no-restricted-imports` enforces that boundary.

## Consequences

- Clear ownership per specialty (venues vs dresses) while `bookings` stays the shared workflow.
- Barrel files (`index.ts`) are required by this architecture even though they can hurt tree-shaking; keep public exports small.
- Category-specific pricing stays in the specialty module; conflict checks stay in `bookings`.
