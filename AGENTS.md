# DAWSON: United States Tax Court's Electronic Filing & Case Management System

This is DAWSON, the United States Tax Court's electronic filing and case management system, a TypeScript/React + Cerebral.js front-end and AWS Lambda back-end, implementing Clean Architecture for federal tax case management workflows.

## Project Information

DAWSON is a monorepo with three primary source trees, organized as concentric Clean Architecture layers (see [docs/clean-architecture.md](docs/clean-architecture.md)):

- [shared/src/business/](shared/src/business/) — inner layers; pure domain logic.
- [web-api/src/](web-api/src/) — back-end "frameworks & drivers" + Lambda entrypoints.
- [web-client/src/](web-client/src/) — React + Cerebral SPA (private app `app.tsx`, public app `appPublic.tsx`).

Data flow: React view → Cerebral sequence → action → API call → Lambda handler → interactor → entity validation + persistence gateway → PostgreSQL / OpenSearch / S3 / SES / SQS / DynamoDB.

### Running, Linting, and Testing the Application

- `.devcontainer`: start a pre-configured codespace container with all dependencies pre-installed. When running as an agent inside the `.devcontainer`, the application DOES NOT start automatically. You must start the stack by running `npm run start:api`, `npm run start:client`, and `npm run start:public` in separate terminal sessions, or you can run `npm run start:all:ci` if you just need a headless stack for integration tests (no scanner, no Cognito, in-memory DynamoDB).
- Lint: `npm run lint`. This runs all linters in one command, but you can also run them separately.
  - ESLint: `npm run lint:js/ts` via [`eslint.config.mjs`](eslint.config.mjs) + custom rules in [`eslint-custom-rules/`](eslint-custom-rules/). Single file: `npm run lint:js/ts:file -- path/to/file.ts`.
  - Stylelint: `npm run lint:css` via [`stylelint.config.js`](stylelint.config.js). Single file: `npm run lint:css:file -- path/to/file.scss`.
  - Swagger: `npm run lint:swagger` via Swagger CLI validation. Single file: `npm run lint:swagger:file -- path/to/file.yaml`.
  - Auto-fix: `npm run lint:fix`.
- Unit tests (Jest, jsdom): Aggregate config via [`jest.config.ts`](jest.config.ts). Single file: `npm run test:file -- path/to/file.test.ts`. The full-suite scripts below run with `--coverage` by default and write reports to `./coverage/`; the `*:file` variants disable coverage.
  - API: `npm run test:api`. Single file: `npm run test:api:file -- path/to/file.test.ts`.
  - Client: `npm run test:client:unit`. Single file: `npm run test:client:unit:file -- path/to/file.test.ts`.
  - Client integration (Cerebral): `npm run test:client:_integration`. Single file: `npm run test:client:integration:file -- path/to/file.test.ts`. Requires the local stack (see "Stack readiness" below).
  - Shared: `npm run test:shared`. Single file: `npm run test:shared:file -- path/to/file.test.ts`.
  - Scripts: `npm run test:scripts`. Single file: `npm run test:scripts:file -- path/to/file.test.ts`.
  - Infrastructure: `npm run test:infrastructure`. Single file: `npm run test:infrastructure:file -- path/to/file.test.ts`.
  - Document generation: `npm run test:document-generation`. Single file: `npm run test:document-generation:file -- path/to/file.test.ts`.
- Test-suite ownership (use this to pick the correct suite for an edited file):
  - `shared/src/**` → `test:shared` (except `shared/src/business/utilities/documentGenerators/**` → `test:document-generation`).
  - `web-api/src/**` → `test:api`.
  - `web-client/src/**` unit specs → `test:client:unit`; Cerebral integration specs (`*.integration.test.ts`, `*.e2e.test.ts` under `web-client/integration-tests/`) → `test:client:_integration`.
  - `scripts/**` → `test:scripts`.
  - `aws/**` (infrastructure lambdas) → `test:infrastructure`.
- Cypress: dispatched via [`scripts/run-cypress.sh`](scripts/run-cypress.sh) against configs `cypress.config.ts`, `cypress-public.config.ts`, `cypress-smoketests*.config.ts`, `cypress-real-user-tests.config.ts`. Specs live under [`cypress/`](cypress/) (`deployed-and-local/`, `local-only/`, `readonly/`, `real-users/`).
  - Integration: `npm run cypress:integration` (headless) or `npm run cypress:integration:open` (headed). Single file: `npm run cypress:integration:file -- path/to/file.cy.ts`.
  - Integration (Public): `npm run cypress:integration:public` (headless) or `npm run cypress:integration:public:open` (headed). Single file: `npm run cypress:integration:public:file -- path/to/file.cy.ts`.
  - Read-only: `npm run cypress:readonly` (headless) or `npm run cypress:readonly:open` (headed). Single file: `npm run cypress:readonly:file -- path/to/file.cy.ts`.
  - Read-only (Public): `npm run cypress:readonly:public` (headless) or `npm run cypress:readonly:public:open` (headed). Single file: `npm run cypress:readonly:public:file -- path/to/file.cy.ts`.
  - Smoke tests: `npm run cypress:smoketests` (headless) or `npm run cypress:smoketests:open` (headed). Single file: `npm run cypress:smoketests:file -- path/to/file.cy.ts`.
  - Real-user tests: `npm run cypress:real-users` (headless) or `npm run cypress:real-users:open` (headed).

### Project-specific conventions

- Clean Architecture import rule: `shared/src/business/useCases/*` and `entities/*` MUST NOT import from `web-api/`, `web-client/`, AWS SDKs, or persistence modules. Reach outward only via `applicationContext` methods (`getPersistenceGateway`, `getUseCases`, `getUseCaseHelpers`, `getUtilities`, `getDocumentGenerators`). See [docs/clean-architecture.md](docs/clean-architecture.md).
- Naming:
  - Interactors: `verbNounInteractor.ts` co-located with `verbNounInteractor.test.ts` in `shared/src/business/useCases/…`.
  - Cerebral actions: `verbNounAction.ts(x)` in [`web-client/src/presenter/actions/`](web-client/src/presenter/actions/) (or feature subfolder); each pairs with `*.test.ts`.
  - Cerebral sequences: `verbNounSequence.ts` in [`web-client/src/presenter/sequences/`](web-client/src/presenter/sequences/), composed of actions; registered in [`presenter.ts`](web-client/src/presenter/presenter.ts) / `presenter-public.ts`.
  - Entities: PascalCase classes extending `JoiValidationEntity` (see [`JoiValidationEntity.ts`](shared/src/business/entities/JoiValidationEntity.ts)); validation constants in `EntityValidationConstants.ts` / [`JoiValidationConstants.ts`](shared/src/business/entities/JoiValidationConstants.ts).
  - Lambda handlers: `*Lambda.ts` under [`web-api/src/lambdas/`](web-api/src/lambdas/), wrapped with `genericHandler` for auth/error/CORS.
- Two separate React apps share entities/use-cases: do not put browser-only code in `shared/`. Public-facing additions go to `appPublic.tsx` / `applicationContextPublic.ts` and the `public-api/` lambdas.
- Three `applicationContext` implementations exist (web-api, web-client private, web-client public); when adding a context method, update all three to keep parity.
- Interactor ordering: validate the entity (Joi via `JoiValidationEntity`) **before** invoking persistence — never persist first and validate after, and never reach a persistence gateway from an unvalidated entity.
- Query generation: DAWSON uses Kysely for query generation. Database schema is defined in `web-api/src/persistence/postgres/database-schema.ts`.
- Error handling: ensure that all errors always make their way to an end user if an end user initiated the action in the application.
- `CHANGES.md`: any change that requires a manual deployment step (env-var, container bump, migration ordering, reindex, schema change) gets a new `<details><summary>…</summary>` block prepended to [`CHANGES.md`](CHANGES.md). Mirror the same notes in the PR description.
- Postgres zero-downtime migrations: DAWSON utilizes blue/green deployments where the "active" environment remains running while the "passive" environment deploys. Migrations must never destructively modify tables or columns that the active color relies on. For destructive schema changes, use the expand/contract pattern.
- Postgres schema artifacts: any new Kysely migration under [`web-api/src/persistence/postgres/utils/migrate/`](web-api/src/persistence/postgres/utils/migrate/) must be paired with updates to [`docs/postgres/schema/data-dictionary.csv`](docs/postgres/schema/data-dictionary.csv) (column-level documentation) and [`docs/postgres/schema/erd.mmd`](docs/postgres/schema/erd.mmd) (Mermaid ERD).
- Local seeded users: the canonical fixture is [`web-api/storage/fixtures/seed/users.json`](web-api/storage/fixtures/seed/users.json), loaded into Cognito-local by [`.cognito/seedCognitoLocal.ts`](.cognito/seedCognitoLocal.ts) and re-exported for unit/integration tests via [`shared/src/test/mockUserTokenMap.ts`](shared/src/test/mockUserTokenMap.ts). Use these emails (paired with the `loginAs*` helpers in Cypress) to reproduce role-specific bugs in the local UI; do not invent test users.
- Local sample documents/PDFs live under [`shared/test-assets/`](shared/test-assets/) and [`web-api/storage/fixtures/`](web-api/storage/fixtures/). For bugs that require a customer-supplied "afflicted" PDF that is not in-repo, request the asset from the operator before claiming a reproduction.
- Path aliases come from [`tsconfig.json`](tsconfig.json) and are mapped into Jest via [`utils/load-tsconfig-paths.mjs`](utils/load-tsconfig-paths.mjs).

## Agent Expectations

### General Expectations

- Test coverage: every code change must ship with unit tests in the suite that owns the file (see "Test-suite ownership" above) and must hit 100% line + branch coverage for the added/modified code. Verify by running the owning full-suite script (which emits `--coverage` by default) and inspecting `./coverage/lcov-report/index.html` (or `coverage/clover.xml` / `coverage-final.json`) for the changed files. The `*:file` variants skip coverage and are only suitable for fast iteration, not for the final coverage check.
  - Exempt from new unit tests: pure documentation (`docs/**`, `*.md`), Terraform-only changes (`web-api/terraform/**`, `web-client/terraform/**`), and CircleCI config (`.circleci/**`). Everything else (including shell scripts under `scripts/` and `aws/lambdas/`) needs tests in its owning suite.
- Cypress coverage: any user-facing change requires Cypress specs under [`cypress/`](cypress/) that exercise every applicable role. Use the canonical role helpers in [`cypress/helpers/authentication/login-as-helpers.ts`](cypress/helpers/authentication/login-as-helpers.ts) (`loginAs*`).
- Accessibility: all UI must satisfy Section 508 and WCAG 2.1 AA. Verify by adding/extending a Cypress spec that calls the shared [`checkA11y`](cypress/local-only/support/generalCommands/checkA11y.ts) helper (built on `cypress-axe` + `axe-core`); see [`cypress/local-only/tests/accessibility/`](cypress/local-only/tests/accessibility/) for exemplar specs. Prefer existing accessible primitives in [`ustc-ui/`](web-client/src/ustc-ui/) and [`dawson-ui/`](web-client/src/dawson-ui/); preserve semantic HTML, label associations, focus order, and keyboard operability.
- Visual PDF tests: if a ticket DoD requires "visual tests for newly added PDFs," do not fabricate a snapshot tool or claim one doesn't exist. DAWSON uses a custom image diffing utility (`generateAndVerifyPdfDiff`) in `shared/src/business/utilities/documentGenerators/generateAndVerifyPdfDiff.ts` that relies on `pdf2pic` and `pixelmatch`. Refer to existing `*.test.ts` files in that folder for usage examples.
- Cerebral state debugging: for "list/data disappears after a sequence runs" bugs, inspect the action chain in the relevant `*Sequence.ts`, the state shape in [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts), and the action that runs on modal close — these bugs are usually a missing re-fetch or a state path being cleared without being re-populated.
- Pre-verification hygiene: before declaring work ready, lint all added and modified files, fixing errors as necessary, and then run `npx prettier write` to format code based on the project's prettier configuration. Do not bypass these tools or hand-format around them.
- TypeScript discipline: annotate function parameters and return types; do not rely on inference where an explicit annotation is possible. Prefer type annotations over assertions; do not use `as any` or non-null `!` assertions to silence the type checker — fix the underlying type. Confirm the change type-checks with `npx tsc --noEmit -p tsconfig.json` if Jest/ESLint do not already exercise the file.
- Styling: prefer Tailwind utility classes with the `tw:` prefix (e.g. `className="tw:flex tw:mt-4"`, see [`web-client/src/views/Login/Login.tsx`](web-client/src/views/Login/Login.tsx)) over USWDS classes when both are viable; reserve USWDS classes for component patterns that depend on USWDS behavior/markup.
- Local stack required for E2E/integration: Cypress and `test:client:_integration` assume the local API + clients are reachable.
  - Probe ports before starting anything: API `http://localhost:4000/api/swagger`, OpenSearch `http://localhost:9200/`, private UI `http://localhost:1234/`, public UI `http://localhost:5678/`. A 200/401 from any of these means that service is **already running**.
  - To wait for the API + OpenSearch to come up after a fresh start: `./wait-until-services.sh`.
  - One-shot stack for headless test runs: `npm run start:all:ci`.
- Verify honestly: never report a bug "fixed" or an issue "resolved" without executing the verifying command/test and capturing concrete evidence — the exact command, its exit code, and the relevant stdout lines (or, for UI changes, the URL exercised, the role used, and a screenshot or DOM excerpt).
- Code Review: before reporting a bug "fixed" or an issue "resolved", you must perform a self code review enforcing the **Code Review Guidelines** below.
- Source control:
  - Group files by functional intent — one commit per logical change; do not co-mingle unrelated edits.
  - Format messages as `<PREFIX>: <concise description>` — colon-space between prefix and summary.
    - Resolve `<PREFIX>` in this order: (1) the issue number of the associated issue, otherwise (2) the task slug embedded in the current git branch name (e.g. `DAW-1234` or `9809` from `git rev-parse --abbrev-ref HEAD`), otherwise (3) the open pull request number from `gh pr view --json number,headRefName`, otherwise (4) a short scope tag matching repo precedent (`devex:`, `deps:`, `docs:`) when the change does not map to a single ticket — verify by `git log --oneline -20` to match existing convention.

### Interactive Agent

- **Be mindful of pagers!** Programs like `git`, `gh`, `aws`, `less`, etc. can freeze an interactive agent by waiting for keyboard input. ALWAYS ensure you pass `PAGER=cat` as an environment variable (e.g., `PAGER=cat git diff`), or use specific flags like `--no-pager`, to stream output properly.
- Out-of-repo Definition-of-Done items (TestRail test runs, validation in the Court's test environment, user-guide updates, screen-reader spot-checks): the agent cannot complete these from this environment. Surface every applicable item in the PR description and in the hand-off back to the operator with the exact action requested — do not silently leave DoD checkboxes unchecked.
- Scratch files: write throwaway scripts, fixtures, and debug output under `/tmp` (or delete them in the same turn). Never leave temporary artifacts in the working tree where they could be staged or committed by accident.
- Running the application: Before running the application, probe the ports to see if the application is already running. Prefer to leave the operator's `start:api` / `start:client` / `start:public` sessions in place and prefer `start:api:resume` to skip re-seeding.
- Communication: when asking the operator questions, be concise but provide sufficient context to avoid back-and-forth. When providing instructions, be explicit and step-by-step to ensure clarity.
- Verification: when verification is not possible from the agent's environment (e.g. browser-based, deployed, or role-gated checks), give the operator the exact command(s) to run and name the specific output you need back (e.g. "paste the final 20 lines of the Cypress run summary" or "the network response status for `POST /cases`") before continuing.

### Code Review Guidelines

When performing code review, flag violations of the following:

1. **Clean Architecture Violations**: Reject any change that imports `web-api/`, `web-client/`, AWS SDKs, or persistence modules into `shared/src/business/`.
2. **Missing Migrations Documentation**: If `web-api/src/persistence/postgres/utils/migrate/` has new files, verify `docs/postgres/schema/data-dictionary.csv` and `docs/postgres/schema/erd.mmd` are also updated.
3. **Interactor Ordering**: Reject if an interactor persists an entity before successfully validating it via `JoiValidationEntity`.
4. **TypeScript Discipline**: Flag the use of `as any`, non-null assertions (`!`), or missing return type annotations.
5. **Styling**: Flag new usages of USWDS utility classes if a Tailwind equivalent with the `tw:` prefix could be used.
6. **Missing Test Coverage**: If a source file is modified but its corresponding `*.test.ts` (or `*.cy.ts` for UI) is absent from the PR, remind the author that 100% line/branch coverage and Cypress role permutations are required by `AGENTS.md`.
7. **Acceptance Criteria**: Examine the original ticket or task in detail, examine all added and modified code, and assert that all acceptance criteria have been met.
8. **Linting and Formatting**: Check the diff for ESLint, Stylelint, Shellcheck, and Prettier inconsistencies.
9. **Safe Migrations**: Flag any Postgres migration under `web-api/src/persistence/postgres/utils/migrate/` that destructively modifies tables or columns currently in use. Because DAWSON uses zero-downtime blue/green deployments, the "active" color is still running while migrations execute on the "passive" color. Suggest the expand/contract pattern for any destructive schema changes.
