---
applyTo: "cypress/**"
---

# Cypress Test Conventions

## Purpose

Rules for end-to-end and integration test specs under `cypress/`.

## Role Permutations

- Any user-facing change requires Cypress specs exercising every applicable role
- Use the canonical role helpers in `cypress/helpers/authentication/login-as-helpers.ts`
  (`loginAs*`)
- Seeded users are in `web-api/storage/fixtures/seed/users.json` — do not invent test users

## Accessibility

- All UI must satisfy Section 508 and WCAG 2.1 AA
- Verify by adding/extending a Cypress spec that calls `checkA11y`
  (from `cypress/local-only/support/generalCommands/checkA11y.ts`)
- See `cypress/local-only/tests/accessibility/` for exemplar specs

## Test Best Practices

- Each `it()` block must be able to run in isolation
- Never wait for a fixed time interval; wait for a deterministic condition
- Never rely on state or side effects from other tests

## Local Stack Requirements

- Cypress assumes the local API + clients are reachable
- Probe ports before starting:
  - API: `http://localhost:4000/api/swagger`
  - OpenSearch: `http://localhost:9200/`
  - Private UI: `http://localhost:1234/`
  - Public UI: `http://localhost:5678/`
- A 200/401 from any of these means that service is already running

## Running Cypress

- Integration: `npm run cypress:integration` (headless) or `cypress:integration:open` (headed)
- Integration (Public): `npm run cypress:integration:public`
- Read-only: `npm run cypress:readonly`
- Smoke tests: `npm run cypress:smoketests`
- Single file: `npm run cypress:integration:file -- path/to/file.cy.ts`
