# Homaid — Home Services Platform

A portfolio project for discovering home services and creating service bookings. This repository is a learning scaffold covering a React client, Node.js/Express API, MongoDB persistence, Docker Compose, and an Nginx reverse proxy.

## Architecture

- `frontend/` — React application for browsing services and submitting bookings.
- `backend/` — Express REST API with catalog and booking endpoints.
- `deploy/` — local Docker Compose and Nginx configuration.
- `docs/` — architecture, API, runbook, security notes, and roadmap.

## Local development

Prerequisites: Docker Desktop / Docker Engine with Compose.

```bash
docker compose -f deploy/docker-compose.yml up --build
```

Open the frontend at http://localhost:8080. The API health endpoint is available at http://localhost:3000/health.

## Project status

This is a development scaffold, not a production-ready booking platform. Before production, add authentication and role-based authorization, input validation, rate limiting, payment integration, audit logging, backups, observability, secrets management, and automated tests. Review `docs/security.md` and `docs/roadmap.md`.

## Suggested learning sequence

1. Run the application locally and trace a booking request from React to Express and MongoDB.
2. Add automated unit and API tests.
3. Build and scan container images.
4. Deploy to a GKE cluster using a Helm chart.
5. Add CI/CD promotion, monitoring, and operational runbooks.

## License

Educational and portfolio use. Add an explicit license before redistributing this project.