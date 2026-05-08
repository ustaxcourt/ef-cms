---
applyTo: "**/*.test.ts"
---

# Testing Standards

## Purpose

Rules for all unit and integration test files across the monorepo.

## Coverage Requirements

- Every code change must ship with unit tests hitting 100% line + branch coverage
  (or as close as possible) for the added/modified code
- Verify with the owning full-suite script (emits `--coverage` by default);
  inspect `./coverage/lcov-report/index.html`
- The `*:file` variants skip coverage — suitable for fast iteration only

## Test-Suite Ownership

Pick the correct suite for an edited file:

- `shared/**` → `npm run test:shared`
  - Exception: `shared/src/business/utilities/documentGenerators/**` → `npm run test:document-generation`
- `web-api/**` → `npm run test:api`
- `web-client/src/**` unit specs → `npm run test:client:unit`
- `web-client/integration-tests/**` → `npm run test:client:_integration`
- `scripts/**` → `npm run test:scripts`
- `aws/**` → `npm run test:infrastructure`

Single-file commands: `npm run test:<suite>:file -- path/to/file.test.ts`

## Test Best Practices

- Each `it()` block must be able to run in isolation — no reliance on state,
  data, or side effects from other tests
- Never wait for a fixed time interval; wait for a deterministic condition
- Tests must make meaningful assertions — not just snapshot-only or
  "mock was called" without verifying arguments

## Mock ApplicationContext

- Server tests: `shared/src/business/test/createTestApplicationContext.ts`
- Client tests: `web-client/src/test/createClientTestApplicationContext.ts`

## Exempt from Unit Tests

- Pure documentation (`docs/**`, `*.md`)
- Terraform-only changes (`web-api/terraform/**`, `web-client/terraform/**`)
- CircleCI config (`.circleci/**`)

## Test Fixtures

- Use seeded users from `web-api/storage/fixtures/seed/users.json`
- Sample documents/PDFs: `shared/test-assets/` and `web-api/storage/fixtures/`
- Never commit real credentials, API keys, JWTs, or PII in fixtures or tests
