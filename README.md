# Homaid — Home Services Booking Platform

A full-stack application that connects customers with home-service categories and captures booking requests. The implementation stays within the resume project stack: React, Node.js REST APIs, MongoDB, Docker, and Git.

## Capabilities

- Browse a service catalogue and select a service.
- Submit a booking with customer contact details, address, and requested time.
- Retrieve a booking using its booking ID and one-time access token (the API never exposes bookings by email alone).
- Enforce an explicit booking state machine for provider/admin updates.
- Persist bookings in MongoDB with indexes and atomic state transitions.
- Run the web app, API, and database together with Docker Compose.

## Architecture

The React SPA talks to the Node.js/Express API through the Nginx reverse proxy. The API validates requests, applies security headers and rate limits, and persists booking records to MongoDB. See docs/architecture.md and docs/api.md.

## Local run

1. Copy .env.example to .env and replace ADMIN_API_TOKEN with a unique random value.
2. Run: docker compose up --build
3. Open http://localhost:8080. The API readiness endpoint is http://localhost:8080/api/ready.

For local API development without containers, run npm install in api/ and set MONGODB_URI to a reachable MongoDB instance.

## Configuration

The API requires MONGODB_URI and MONGODB_DB. WEB_ORIGIN is an explicit CORS allowlist. ADMIN_API_TOKEN protects operational booking-state changes. Never commit .env files or production secrets.

## Validation

Run npm test from api/. The tests cover request validation and allowed/blocked booking transitions. Run npm run check from api/ for syntax validation.

## Security and production checklist

This is a production-oriented portfolio implementation, not a certified production service. Before public launch, place it behind HTTPS, use a managed MongoDB deployment with private networking and backups, rotate secrets through a secret manager, enable centralized logs/metrics, add customer/provider identity and authorization, add abuse/fraud controls, and conduct load, dependency, and security testing. See docs/security.md.

## Project boundaries

This repository demonstrates the Homaid project described in the resume. It does not claim GCP/GKE deployment, payment processing, identity verification, or a live provider marketplace. Those would be separate, explicitly implemented extensions.
