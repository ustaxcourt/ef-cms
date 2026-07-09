# cypress/ — End-to-End Testing

This directory contains DAWSON's Cypress test suites for end-to-end, accessibility, smoke, and read-only testing.

## Test Suites & Commands

- **Single spec**: `npm run cypress:file -- path/to/file.cy.ts`. Multiple specs: comma-separated.
- **Integration** (private): `npm run cypress:integration` (headless) or `npm run cypress:integration:open` (headed).
- **Integration** (public): `npm run cypress:integration:public` (headless) or `npm run cypress:integration:public:open` (headed).
- **Read-only**: `npm run cypress:readonly` / `npm run cypress:readonly:open`.
- **Read-only** (public): `npm run cypress:readonly:public` / `npm run cypress:readonly:public:open`.
- **Smoke tests**: `npm run cypress:smoketests` / `npm run cypress:smoketests:open`.
- **Real-user tests**: `npm run cypress:real-users` / `npm run cypress:real-users:open`.
- Configs: `cypress.config.ts`, `cypress-public.config.ts`, `cypress-smoketests*.config.ts`, `cypress-real-user-tests.config.ts`.
- Dispatched via [`../scripts/tests/run-cypress.ts`](../scripts/tests/run-cypress.ts).
- Specs live under `deployed-and-local/`, `local-only/`, `readonly/`, `real-users/`.

## Local Stack Required

Cypress assumes the local API + clients are reachable. Probe ports before starting:

- API: `http://localhost:4000/api/swagger`
- OpenSearch: `http://localhost:9200/`
- Private UI: `http://localhost:1234/`
- Public UI: `http://localhost:5678/`

A 200/401 from any of these means that service is already running.

## Role Helpers & Seeded Users

- Use the canonical role login helpers in [`helpers/authentication/login-as-helpers.ts`](helpers/authentication/login-as-helpers.ts) (`loginAs*`).
- Backed by seeded users in [`../web-api/storage/fixtures/seed/users.json`](../web-api/storage/fixtures/seed/users.json). Do not invent test users.
- Any role-gated UI change requires Cypress coverage exercising every applicable role via `loginAs*`.

## Accessibility Testing

- All UI must satisfy **Section 508** and **WCAG 2.1 AA**.
- Use the shared [`checkA11y`](local-only/support/generalCommands/checkA11y.ts) helper (built on `cypress-axe` + `axe-core`).
- See [`local-only/tests/accessibility/`](local-only/tests/accessibility/) for exemplar specs.
- Any user-facing change requires a Cypress spec that calls `checkA11y` on the affected view.

## Test Best Practices

- Any `it()` block should be able to run in isolation — no reliance on state/side effects from other tests.
- Never wait for a fixed time interval; wait for a deterministic condition instead.
