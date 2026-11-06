# Architecture

## Components

- Web: React single-page application, served as static assets by Nginx.
- API: Express REST service. It validates all booking input, enforces state transitions, issues a random per-booking access token, and stores only a SHA-256 hash of that token.
- Persistence: MongoDB stores booking records. Unique indexes protect booking IDs and optional idempotency keys.
- Runtime: Docker Compose starts the web, API, and MongoDB services with readiness/health checks and a named persistent volume.

## Request flow

1. Browser loads the SPA from Nginx.
2. Nginx forwards /api requests to the API container.
3. API validates the request, applies request limits, and stores data in MongoDB.
4. Customer receives a booking ID and private token. The token is required to retrieve the booking; email address alone is not an access credential.
5. An operator transition requires the administrative token and an allowed state transition.

## Availability and failure behaviour

The liveness endpoint (/health) indicates the process is running. The readiness endpoint (/ready) remains unavailable until MongoDB connects. API startup fails closed if required secrets or MongoDB are missing. MongoDB outages return 503 for persistence-dependent routes.
