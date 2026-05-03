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
  - `shared/**` (including `shared/src/**` and `shared/admin-tools/**`) → `test:shared` (except `shared/src/business/utilities/documentGenerators/**` → `test:document-generation`).
  - `web-api/**` (including `web-api/src/**` and `web-api/elasticsearch/**`) → `test:api` (except `web-api/hostedEnvironmentTests/**` → `test:api:hosted-environment`).
  - `web-client/src/**` unit specs → `test:client:unit`; Cerebral integration specs (any `*.test.ts` under `web-client/integration-tests/` or `web-client/integration-tests-public/`) → `test:client:_integration`.
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
- Query generation: DAWSON uses Kysely for query generation.
- Error handling: ensure that all errors always make their way to an end user if an end user initiated the action in the application.
- `CHANGES.md`: any change that requires a manual deployment step (env-var, container bump, migration ordering, reindex, schema change) gets a new `<details><summary>…</summary>` block prepended to [`CHANGES.md`](CHANGES.md). Mirror the same notes in the PR description.
- Postgres zero-downtime migrations: DAWSON utilizes blue/green deployments where the "active" environment remains running while the "passive" environment deploys. Migrations must never destructively modify tables or columns that the active color relies on. For destructive schema changes, use the expand/contract pattern.
- Postgres schema artifacts: any new Kysely migration under [`web-api/src/persistence/postgres/utils/migrate/`](web-api/src/persistence/postgres/utils/migrate/) must be paired with updates to [`docs/postgres/schema/data-dictionary.csv`](docs/postgres/schema/data-dictionary.csv) (column-level documentation) and [`docs/postgres/schema/erd.mmd`](docs/postgres/schema/erd.mmd) (Mermaid ERD).
- Local seeded users: the canonical fixture is [`web-api/storage/fixtures/seed/users.json`](web-api/storage/fixtures/seed/users.json), loaded into Cognito-local by [`.cognito/seedCognitoLocal.ts`](.cognito/seedCognitoLocal.ts) and re-exported for unit/integration tests via [`shared/src/test/mockUserTokenMap.ts`](shared/src/test/mockUserTokenMap.ts). Use these emails (paired with the `loginAs*` helpers in Cypress) to reproduce role-specific bugs in the local UI; do not invent test users.
- Local sample documents/PDFs live under [`shared/test-assets/`](shared/test-assets/) and [`web-api/storage/fixtures/`](web-api/storage/fixtures/). For bugs that require a customer-supplied "afflicted" PDF that is not in-repo, request the asset from the operator before claiming a reproduction.

### Sources of Truth

- Repository
  - Path aliases: [`tsconfig.json`](tsconfig.json), mapped into Jest via [`utils/load-tsconfig-paths.mjs`](utils/load-tsconfig-paths.mjs).
- Roles & authorization
  - Role enum: `ROLES` in [`shared/src/business/entities/EntityConstants.ts`](shared/src/business/entities/EntityConstants.ts).
  - Role → permission matrix: [`shared/src/authorization/authorizationClientService.ts`](shared/src/authorization/authorizationClientService.ts).
  - Cypress role login: [`cypress/helpers/authentication/login-as-helpers.ts`](cypress/helpers/authentication/login-as-helpers.ts) (`loginAs*`), backed by the seeded users in [`web-api/storage/fixtures/seed/users.json`](web-api/storage/fixtures/seed/users.json).
- Routing & views
  - Private route table: [`web-client/src/router.ts`](web-client/src/router.ts); public: [`web-client/src/routerPublic.ts`](web-client/src/routerPublic.ts).
  - Sequence registry: [`web-client/src/presenter/presenter.ts`](web-client/src/presenter/presenter.ts) and [`web-client/src/presenter/presenter-public.ts`](web-client/src/presenter/presenter-public.ts).
  - Cerebral state shape: private app: [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts); public app: [`web-client/src/presenter/state-public.ts`](web-client/src/presenter/state-public.ts) — do not introduce top-level state paths without editing the appropriate file.
  - Computeds / derived state: [`web-client/src/presenter/computeds/`](web-client/src/presenter/computeds/).
- HTTP surface
  - OpenAPI specs: hand-maintained single-file spec [`web-api/swagger.json`](web-api/swagger.json), plus versioned docs [`docs/api/v1.yaml`](docs/api/v1.yaml) and [`docs/api/v2.yaml`](docs/api/v2.yaml); `npm run lint:swagger` runs Swagger CLI schema validation against these specs.
  - Lambda handlers live under [`web-api/src/lambdas/`](web-api/src/lambdas/) (`*Lambda.ts`, wrapped with `genericHandler`). Adding a *new* Lambda requires coordinated Terraform and routing changes — prefer extending an existing handler/interactor over introducing a new Lambda.
- Data stores
  - Postgres: schema in [`web-api/src/persistence/postgres/database-schema.ts`](web-api/src/persistence/postgres/database-schema.ts); migrations in [`web-api/src/persistence/postgres/utils/migrate/`](web-api/src/persistence/postgres/utils/migrate/); docs in [`docs/postgres/schema/data-dictionary.csv`](docs/postgres/schema/data-dictionary.csv) and [`docs/postgres/schema/erd.mmd`](docs/postgres/schema/erd.mmd).
  - OpenSearch indices and analyzers: [`web-api/elasticsearch/`](web-api/elasticsearch/). Reindexes run automatically when mappings change (see [`.circleci/config.yml`](.circleci/config.yml)); no separate `CHANGES.md` callout is needed for the reindex itself.
- Asynchronous work
  - Purpose-specific queues: [`web-api/terraform/modules/api/sqs.tf`](web-api/terraform/modules/api/sqs.tf), [`web-api/terraform/modules/api/change-of-address.tf`](web-api/terraform/modules/api/change-of-address.tf), and [`web-api/terraform/modules/opensearch-sync/opensearch-sync.tf`](web-api/terraform/modules/opensearch-sync/opensearch-sync.tf).
  - Worker queue: a single SQS queue dispatched by [`web-api/src/gateways/worker/workerRouter.ts`](web-api/src/gateways/worker/workerRouter.ts). Route new asynchronous work through this router rather than provisioning a new queue.
- Configuration
  - Feature flags: persisted in Postgres ([`web-api/src/persistence/postgres/featureFlag/schema.ts`](web-api/src/persistence/postgres/featureFlag/schema.ts)), cached per-runner on first read by [`web-api/src/business/useCases/featureFlag/getAllFeatureFlagsInteractor.ts`](web-api/src/business/useCases/featureFlag/getAllFeatureFlagsInteractor.ts), and pulled into client state at login by [`web-client/src/presenter/actions/getAllFeatureFlagsAction.ts`](web-client/src/presenter/actions/getAllFeatureFlagsAction.ts).
- Domain constants
  - Event (document filing) codes: `ALL_EVENT_CODES` in [`shared/src/business/entities/EntityConstants.ts`](shared/src/business/entities/EntityConstants.ts).
  - Date/time handling: [`shared/src/business/utilities/DateHandler.ts`](shared/src/business/utilities/DateHandler.ts). A custom ESLint rule forbids direct use of the global `Date`; use `DateHandler`.
  - DAWSON has no i18n; user-facing copy is inline in the views.
- Document generation
  - Generators: [`shared/src/business/utilities/documentGenerators/`](shared/src/business/utilities/documentGenerators/). Visual-diff helper `generateAndVerifyPdfDiff` lives in the same directory; see neighboring `*.test.ts` files for usage.
- Front-end primitives
  - Two component libraries coexist: [`web-client/src/ustc-ui/`](web-client/src/ustc-ui/) (legacy) and [`web-client/src/dawson-ui/`](web-client/src/dawson-ui/) (newer, still maturing). Prefer either over hand-rolled markup; both are acceptable today.
- Build & CI/CD
  - Bundle entrypoints: [`esbuild.config.mjs`](esbuild.config.mjs) (private) and [`esbuild.public.config.mjs`](esbuild.public.config.mjs) (public). These enforce the "no browser-only code in `shared/`" rule at bundle time.
  - CI/CD gates: All tests, except those which can only be performed on deployed environments, are run in GitHub Actions on all PRs to protected branches: [`.github/workflows/`](.github/workflows/).
  - CI/CD: deployments are performed in CircleCI: [`.circleci/config.yml`](.circleci/config.yml).
- Observability
  - Server-side logger: Winston, configured in [`web-api/src/createLogger.ts`](web-api/src/createLogger.ts) and wrapped by [`web-api/src/utilities/logger/getDawsonLogger.ts`](web-api/src/utilities/logger/getDawsonLogger.ts). Use the wrapper; do not call `console.log` from Lambda code.
  - Client-side error reporting is not yet implemented (planned via AWS RUM).
  - CloudWatch alarms exist for specific failure modes (e.g. email delivery failure after retries, overall health failure) under [`web-api/terraform/modules/api/alarms.tf`](web-api/terraform/modules/api/alarms.tf) and [`web-api/terraform/modules/health-alarms/`](web-api/terraform/modules/health-alarms/). When adding a long-running or always-on background workflow, consider whether a paired alarm is warranted.
- Test infrastructure
  - Mock `applicationContext`: [`shared/src/business/test/createTestApplicationContext.ts`](shared/src/business/test/createTestApplicationContext.ts) (server) and [`web-client/src/test/createClientTestApplicationContext.ts`](web-client/src/test/createClientTestApplicationContext.ts) (client).

## Agent Expectations

### General Expectations

- Test coverage: every code change must ship with unit tests in the suite that owns the file (see "Test-suite ownership" above) and must hit 100% line + branch coverage for the added/modified code. Verify by running the owning full-suite script (which emits `--coverage` by default) and inspecting `./coverage/lcov-report/index.html` (or `coverage/clover.xml` / `coverage-final.json`) for the changed files. The `*:file` variants skip coverage and are only suitable for fast iteration, not for the final coverage check.
  - Exempt from new unit tests: pure documentation (`docs/**`, `*.md`), Terraform-only changes (`web-api/terraform/**`, `web-client/terraform/**`), and CircleCI config (`.circleci/**`). Everything else (including shell scripts under `scripts/` and `aws/lambdas/`) needs tests in its owning suite.
- Cypress coverage: any user-facing change requires Cypress specs under [`cypress/`](cypress/) that exercise every applicable role. Use the canonical role helpers in [`cypress/helpers/authentication/login-as-helpers.ts`](cypress/helpers/authentication/login-as-helpers.ts) (`loginAs*`).
- Accessibility: all UI must satisfy Section 508 and WCAG 2.1 AA. Verify by adding/extending a Cypress spec that calls the shared [`checkA11y`](cypress/local-only/support/generalCommands/checkA11y.ts) helper (built on `cypress-axe` + `axe-core`); see [`cypress/local-only/tests/accessibility/`](cypress/local-only/tests/accessibility/) for exemplar specs. Prefer existing accessible primitives in [`ustc-ui/`](web-client/src/ustc-ui/) and [`dawson-ui/`](web-client/src/dawson-ui/); preserve semantic HTML, label associations, focus order, and keyboard operability.
- Visual PDF tests: if a ticket DoD requires "visual tests for newly added PDFs," do not fabricate a snapshot tool or claim one doesn't exist. DAWSON uses a custom image diffing utility (`generateAndVerifyPdfDiff`) in `shared/src/business/utilities/documentGenerators/generateAndVerifyPdfDiff.ts` that relies on `pdf2pic` and `pixelmatch`. Refer to existing `*.test.ts` files in that folder for usage examples.
- Cerebral state debugging: for "list/data disappears after a sequence runs" bugs, inspect the action chain in the relevant `*Sequence.ts`, the state shape in [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts), any relevant computed under [`web-client/src/presenter/computeds/`](web-client/src/presenter/computeds/), and the action that runs on modal close — these bugs are usually a missing re-fetch or a state path being cleared without being re-populated.
- Pre-verification hygiene: before declaring work ready, lint all added and modified files, fixing errors as necessary, and then run `npx prettier --write <files/globs>` to format code based on the project's prettier configuration. Do not bypass these tools or hand-format around them.
- TypeScript discipline: annotate function parameters and return types; do not rely on inference where an explicit annotation is possible. Prefer type annotations over assertions; do not use `as any` or non-null `!` assertions to silence the type checker — fix the underlying type. Confirm the change type-checks with `npx tsc --noEmit -p tsconfig.json` if Jest/ESLint do not already exercise the file.
- Styling: prefer Tailwind utility classes with the `tw:` prefix (e.g. `className="tw:flex tw:mt-4"`, see [`web-client/src/views/Login/Login.tsx`](web-client/src/views/Login/Login.tsx)) over USWDS classes when both are viable; reserve USWDS classes for component patterns that depend on USWDS behavior/markup.
- Local stack required for E2E/integration: Cypress and `test:client:_integration` assume the local API + clients are reachable.
  - Probe ports before starting anything: API `http://localhost:4000/api/swagger`, OpenSearch `http://localhost:9200/`, private UI `http://localhost:1234/`, public UI `http://localhost:5678/`. A 200/401 from any of these means that service is **already running**.
  - To wait for the API + OpenSearch to come up after a fresh start: `./wait-until-services.sh`.
  - One-shot stack for headless test runs: `npm run start:all:ci`.
- HTTP contract: any addition, removal, or signature change to an HTTP endpoint must be reflected in [`web-api/swagger.json`](web-api/swagger.json); verify with `npm run lint:swagger`.
- Campsite rule: you may notice that existing code violates some of the guidelines and expectations listed above. Wherever possible (barring large refactors or side quests), always leave the code "better than you found it" by adjusting it to fit established best practices and guidelines, including meeting test coverage objectives.
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
- Deployed environments: operators will have local configuration enabling them to connect to and interact with deployed DAWSON environments. **NEVER connect to deployed environment from an agent session.** If a reproduction requires interaction with a deployed environment, ask the operator to execute the necessary steps in a session that the agent can not access and share the relevant output.
- Communication: when asking the operator questions, be concise but provide sufficient context to avoid back-and-forth. When providing instructions, be explicit and step-by-step to ensure clarity.
- Verification: when verification is not possible from the agent's environment (e.g. browser-based, deployed, or role-gated checks), give the operator the exact command(s) to run and name the specific output you need back (e.g. "paste the final 20 lines of the Cypress run summary" or "the network response status for `POST /cases`") before continuing.

### Code Review Guidelines

When performing code review, flag violations of the following:

1. **Acceptance Criteria**: Examine the original ticket or task in detail, examine all added and modified code, and assert that all acceptance criteria have been met.
1. **TypeScript Discipline**: Flag the use of `as any`, non-null assertions (`!`), or missing return type annotations.
1. **Missing Test Coverage**: If a source file is modified but its corresponding `*.test.ts` (or `*.cy.ts` for UI) is absent from the PR, remind the author that 100% line/branch coverage and Cypress role permutations are required by `AGENTS.md`.
1. **Clean Architecture Violations**: Reject any change that imports `web-api/`, `web-client/`, AWS SDKs, or persistence modules into `shared/src/business/`.
1. **Missing Migrations Documentation**: If `web-api/src/persistence/postgres/utils/migrate/` has new files, verify `docs/postgres/schema/data-dictionary.csv` and `docs/postgres/schema/erd.mmd` are also updated.
1. **Interactor Ordering**: Reject if an interactor persists an entity before successfully validating it via `JoiValidationEntity`.
1. **Validate Before Persist (entities)**: Beyond interactor ordering, flag any code path that constructs a non-`JoiValidationEntity` ad-hoc object and writes it directly to a persistence gateway, bypassing the validation surface entirely.
1. **Styling**: Flag new usages of USWDS utility classes if a Tailwind equivalent with the `tw:` prefix could be used.
1. **Linting and Formatting**: Check the diff for ESLint, Stylelint, Shellcheck, and Prettier inconsistencies.
1. **Safe Migrations**: Flag any Postgres migration under `web-api/src/persistence/postgres/utils/migrate/` that destructively modifies tables or columns currently in use. Because DAWSON uses zero-downtime blue/green deployments, the "active" color is still running while migrations execute on the "passive" color. Suggest the expand/contract pattern for any destructive schema changes.
1. **Endpoint Documentation**: If a change adds, removes, or alters the signature of an HTTP endpoint without a corresponding update to `web-api/swagger.json`, flag it.
1. **Browser-Only Code in `shared/`**: Flag any import of `window`, `document`, DOM APIs, React, Cerebral, or other browser/runtime-specific modules from within `shared/`. Such code belongs in `web-client/` (or, for public-only code, gated to the public app).
1. **`genericHandler` Usage**: Flag any new or modified `*Lambda.ts` under `web-api/src/lambdas/` that does not wrap its handler with `genericHandler` (the auth/error/CORS contract). New Lambdas should also be questioned on principle — prefer extending an existing handler/interactor.
1. **Logging Discipline**: Flag `console.log` / `console.error` calls in `web-api/` Lambda or interactor code; require the Winston wrapper (`getDawsonLogger`). Also flag any log statement that appears to emit raw user PII, document contents, or application secrets.
1. **Date/Time Imports**: Flag direct imports of `luxon`, `date-fns`, `moment`, or hand-rolled `new Date()` arithmetic in business logic; require `DateHandler`.
1. **Cerebral State Discipline**: Flag any new top-level state path used in actions/computeds/views that is not declared in [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts). Also flag sequences that clear a state path without an action that re-populates it before the user sees an empty list.
1. **Naming Conventions**: Flag files whose names diverge from the documented patterns (`verbNounInteractor.ts`, `verbNounAction.ts(x)`, `verbNounSequence.ts`, `*Lambda.ts`, PascalCase entity classes) or that are missing their co-located `*.test.ts`.
1. **Error Surfacing**: Flag swallowed errors (empty `catch`, `catch` that only logs, promise chains without rejection handling) on user-initiated paths. Errors from user actions must reach the end user.
1. **Accessibility Coverage**: For any user-facing change, flag the absence of (or failure to extend) a Cypress spec that calls `checkA11y` on the affected view, and flag regressions in semantic HTML, label associations, focus order, or keyboard operability.
1. **Cypress Role Permutations**: For role-gated UI changes, flag the absence of Cypress coverage exercising every applicable role via `loginAs*` helpers.
1. **Visual PDF Tests**: Flag new or materially altered PDF generators under `shared/src/business/utilities/documentGenerators/` that ship without a `generateAndVerifyPdfDiff`-based snapshot test.
1. **`CHANGES.md` Callout**: Flag any change requiring a manual step (pre-deployment script, local environment configuration change, etc.) that lacks a new `<details>` block prepended to `CHANGES.md` and mirrored in the PR description.
1. **Public vs. Private Surface**: Flag additions to `app.tsx` / `applicationContext.ts` / `web-api/src/lambdas/` that should have landed on the public counterparts (`appPublic.tsx` / `applicationContextPublic.ts` / `public-api/`), or vice versa.
1. **Test Quality, Not Just Coverage**: Beyond coverage, flag tests that achieve coverage without meaningful assertions (snapshot-only on logic, asserting only that a mock was called without verifying arguments, tests that pass against both the buggy and fixed implementation, etc.).
1. **Secrets and Fixtures**: Flag any committed credentials, API keys, JWTs, or real PII in fixtures, tests, or logs. Use the seeded users and test assets already in the repo.
1. **Dependency Hygiene**: Flag new runtime dependencies added without justification in the PR description, especially when an existing utility already covers the use case. Dependencies must be pinned to specific versions; flag any dependency not pinned to a specific version.
