# REST API contract

All API routes are under /api. JSON request bodies are limited to 32 KB.

## Catalogue

- GET /api/services — list service categories and indicative prices.
- GET /api/services/:id — retrieve a service or 404.

## Bookings

- POST /api/bookings — create a request. Required fields: serviceId, customerName, customerEmail, address, scheduledAt. Optional: notes. scheduledAt must be at least one hour in the future. Optional Idempotency-Key prevents duplicate submissions (unique key).
- GET /api/bookings/:id — retrieve a booking. Requires X-Booking-Token from creation. A booking ID alone is not sufficient.
- PATCH /api/bookings/:id/status — operator-only state transition. Requires X-Admin-Token. Valid states: requested → confirmed → in_progress → completed; requested/confirmed may also transition to cancelled. Terminal states cannot be reopened.

## Status and error codes

201 created; 200 success; 204 preflight; 400 validation/JSON error; 401 missing/invalid access token; 404 unknown or inaccessible booking; 409 invalid/concurrent transition or duplicate idempotency key; 429 rate limit; 503 database unavailable; 500 unexpected server error.

## Example booking body

    { "serviceId": "cleaning", "customerName": "A Customer", "customerEmail": "a@example.com", "address": "12 Example Street", "scheduledAt": "2030-01-01T10:00:00.000Z" }

The response contains bookingId and accessToken. Save the token securely; it is not returned again.
