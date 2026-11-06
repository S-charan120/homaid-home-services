# Security controls and launch checklist

## Implemented in this repository

- Helmet security headers; Express fingerprint header disabled.
- Explicit CORS origin allowlist; no wildcard origin.
- Request body size cap and API rate limiting, with a tighter booking-write limit.
- Booking access uses a cryptographically random token; only its SHA-256 hash is persisted. Token comparison for the operator secret uses constant-time comparison.
- Operator state updates require X-Admin-Token and a permitted state transition.
- Customer records are not queryable by email alone. Logs avoid booking payloads and customer PII.
- Containers run the API as the non-root node user; secrets are environment-injected and excluded from Git.

## Required before public production

- Replace the demo operator token with a managed identity provider and role-based authorization; rotate secrets using a secret manager.
- Use managed MongoDB with private connectivity, TLS, encryption, backups, point-in-time recovery, and tested restores.
- Terminate HTTPS at a managed edge, restrict network ingress, and configure trusted proxy behaviour deliberately.
- Add fraud/abuse detection, bot protection, consent/retention policy, audit logs, and data-subject deletion workflows.
- Pin and scan dependencies and images; produce an SBOM; run SAST/DAST and independent penetration testing.
- Add structured centralized logs, metrics, distributed tracing, alerts, and an on-call runbook.
- Validate load limits, connection pool sizing, disaster recovery objectives, and database migrations.

The static ADMIN_API_TOKEN is a controlled portfolio/demo mechanism, not a substitute for a real operator identity platform.
