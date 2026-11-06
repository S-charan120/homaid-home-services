# Local testing guide

This guide uses the Docker Compose stack so the browser, API and MongoDB run with the same service names used in the Nginx proxy configuration.

## 1. Start the application

Copy the example environment file and set an operator token:

```bash
cp .env.example .env
# Edit .env and set ADMIN_API_TOKEN to a unique random value.
docker compose up --build -d
docker compose ps
```

Open http://localhost:8080. Check the API through the web proxy:

```bash
curl -i http://localhost:8080/health
curl -i http://localhost:8080/ready
```

These exact Nginx paths proxy to the API's /health and /ready routes. The readiness endpoint returns 503 until MongoDB is connected.

## 2. Check the service catalogue

```bash
curl -s http://localhost:8080/api/services
```

Pick a service ID from the response. The catalogue is intentionally small and static in this version.

## 3. Submit a booking request

The API requires a time at least one hour in the future. This example creates a timestamp two days from now:

```bash
SCHEDULED_AT=$(node -e "console.log(new Date(Date.now() + 2 * 86400000).toISOString())")

curl -i -X POST http://localhost:8080/api/bookings \
  -H 'Content-Type: application/json' \
  -H "Idempotency-Key: $(node -e 'console.log(require("crypto").randomUUID())')" \
  -d "{
    \\"serviceId\\": \\"cleaning\\",
    \\"customerName\\": \\"Demo Customer\\",
    \\"customerEmail\\": \\"demo@example.com\\",
    \\"address\\": \\"12 Example Street, Hyderabad\\",
    \\"scheduledAt\\": \\"$SCHEDULED_AT\\",
    \\"notes\\": \\"Please call before arriving\\"
  }"
```

A successful response returns a `bookingId` and a one-time `accessToken`. Save both values for the next step; the raw token is not stored by the API or returned again.

## 4. Retrieve the booking

Use the booking ID in the route and the access token in the header:

```bash
curl -i http://localhost:8080/api/bookings/<BOOKING_ID> \
  -H 'X-Booking-Token: <ACCESS_TOKEN>'
```

A request with the wrong token or a non-existent booking returns 404. The API does not expose customer bookings through an email-only lookup.

## 5. Exercise the booking lifecycle

Set the same `ADMIN_API_TOKEN` value that you configured in `.env`:

```bash
export ADMIN_API_TOKEN='replace-with-your-local-token'
curl -i -X PATCH http://localhost:8080/api/bookings/<BOOKING_ID>/status \
  -H 'Content-Type: application/json' \
  -H "X-Admin-Token: $ADMIN_API_TOKEN" \
  -d '{"status":"confirmed"}'
```

Valid transitions:

- requested → confirmed or cancelled
- confirmed → in_progress or cancelled
- in_progress → completed
- completed and cancelled are terminal states

A transition outside this lifecycle returns 409. The update uses the current status in its database filter so concurrent updates cannot silently overwrite one another.

## 6. Run the automated checks

```bash
cd api
npm install
npm test
npm run check
cd ../web
npm install
npm run build
```

GitHub Actions runs these checks and builds the API and web container images on pushes and pull requests to `main`.

## 7. Stop the stack

```bash
docker compose down
```

The named MongoDB volume is retained. To delete the local database as well, use `docker compose down -v`; this permanently removes local test data.
