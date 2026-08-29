# ADR 0002: Booking conflict strategy

## Status

Accepted (to be implemented with the bookings module)

## Context

Vendor types do not share one occupancy model:

- Venues: one date (or date range) per space
- Photographers / planners / makeup / catering: typically a date plus a package
- Photo locations: hours on a date
- Dress rentals: a dress + size + a period from fitting through return, which must not overlap another bride

A single `availability` row per vendor-date is not enough for dresses.

## Decision

1. Shared `availability` (vendor_id + date + is_available) blocks calendar-level conflicts for date-based vendors.
2. Unified `bookings` row holds customer, vendor, event_date, status, and price for every category.
3. `dress_bookings` extends a booking with `dress_id`, `selected_size`, `fitting_date`, `pickup_date`, and `return_date`.
4. Dress overlap is a range query: reject a new request when another active booking for the same `dress_id` has `[fitting_date, return_date]` overlapping the requested window (status not cancelled).
5. Conflict checks run in `bookings` services (Zod-validated, never only in the UI) and will be covered by unit + RLS tests.

## Consequences

- Category UIs can differ; the source of truth for "can we book?" is one module.
- Dress inventory is per-dress, not per-vendor-day.
- Indexes on `bookings.vendor_id`, `bookings.event_date`, `availability(vendor_id, date)`, and `dress_bookings(dress_id, fitting_date, return_date)` are required.
