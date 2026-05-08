---
description: "Use when performing code review, reviewing a pull request, or auditing code changes for DAWSON project standards compliance."
---

# DAWSON Code Review Checklist

## Purpose

Comprehensive checklist for code review. Flag violations of any of the following.

## Acceptance Criteria

- Examine the original ticket or task in detail
- Assert that all acceptance criteria have been met in the added/modified code

## TypeScript Discipline

- Flag `as any` or non-null assertions (`!`)
- Flag missing return type annotations on functions
- Prefer type annotations over assertions — fix the underlying type

## Test Coverage

- Every modified source file needs a corresponding `*.test.ts`
- 100% line + branch coverage for added/modified code
- UI changes require Cypress specs (`*.cy.ts`) exercising every applicable role
- Flag tests with only trivial assertions (snapshot-only, unchecked mock arguments)
- Flag tests that depend on state or side effects from other `it()` blocks

## Clean Architecture

- Reject imports of `web-api/`, `web-client/`, AWS SDKs, or persistence modules
  into `shared/src/business/`
- Flag browser-only code (`window`, `document`, DOM APIs, React, Cerebral) in `shared/`

## Entity & Interactor Ordering

- Reject if an interactor persists before validating via `JoiValidationEntity`
- Flag ad-hoc objects written to persistence without passing through validation

## Migrations

- Flag destructive modifications to tables/columns the active color relies on
- Suggest expand/contract pattern for destructive schema changes
- Verify `data-dictionary.csv` and `erd.mmd` are updated for new migrations

## Lambda Handlers

- Flag `*Lambda.ts` files not wrapped with `genericHandler`
- Question new Lambdas — prefer extending existing handlers/interactors

## Logging & Secrets

- Flag `console.log`/`console.error` in `web-api/` — require `getDawsonLogger`
- Flag log statements emitting raw PII, document contents, or secrets
- Flag committed credentials, API keys, JWTs, or real PII in fixtures/tests/logs

## Styling

- Flag new USWDS utility classes when a Tailwind `tw:` equivalent exists

## Date/Time

- Flag direct imports of `luxon`, `date-fns`, `moment`, or `new Date()` arithmetic
- Require `DateHandler`

## Cerebral State

- Flag new top-level state paths not declared in `state.ts` / `state-public.ts`
- Flag sequences that clear a state path without re-populating it

## Naming Conventions

- Flag files diverging from: `verbNounInteractor.ts`, `verbNounAction.ts(x)`,
  `verbNounSequence.ts`, `*Lambda.ts`, PascalCase entity classes
- Flag missing co-located `*.test.ts`

## Error Surfacing

- Flag swallowed errors (empty `catch`, log-only `catch`, unhandled rejections)
  on user-initiated paths

## Endpoint Documentation

- Flag HTTP endpoint changes without a corresponding `web-api/swagger.json` update

## Public vs. Private Surface

- Flag additions to `app.tsx` / `applicationContext.ts` that belong on the public
  counterparts (`appPublic.tsx` / `applicationContextPublic.ts` / `public-api/`)

## Accessibility

- Flag missing `checkA11y` Cypress specs for user-facing changes
- Flag regressions in semantic HTML, labels, focus order, keyboard operability

## `CHANGES.md`

- Flag changes requiring manual steps that lack a `<details>` block in `CHANGES.md`

## Dependencies

- Flag new runtime dependencies without PR justification
- Flag dependencies not pinned to specific versions

## Linting & Formatting

- Check the diff for ESLint, Stylelint, Shellcheck, and Prettier inconsistencies
