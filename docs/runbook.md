# Operations runbook

## Start and inspect

- Start: docker compose up --build -d
- Status: docker compose ps
- API logs: docker compose logs -f api
- Web logs: docker compose logs -f web
- API liveness: GET /health
- API readiness: GET /ready

## Common failures

- API unhealthy: inspect MONGODB_URI, service DNS name, port 27017, database logs, and API startup logs.
- Web shows API errors: inspect Nginx /api proxy path and API health; verify both containers share the Compose network.
- Booking returns 400: check serviceId, email format, address length, ISO timestamp, and future-time requirement.
- Booking retrieval returns 404: verify both bookingId and the original X-Booking-Token; only the hash is stored.
- State update returns 409: read current status; only documented forward transitions are valid. Retry after checking whether another operator updated it.
- Rate limit returns 429: review client retry behaviour; do not simply remove limits.

## Recovery

Back up the MongoDB volume using a database-consistent backup procedure before upgrades. Test restores into an isolated environment. Deploy a pinned image digest and roll back to the last known-good digest if health checks fail. Do not delete the persistent data volume during application rollback.
