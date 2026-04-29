# DAWSON: United States Tax Court's Electronic Filing & Case Management System

This is DAWSON, the United States Tax Court's electronic filing and case management system, a TypeScript/React + Cerebral.js front-end and AWS Lambda back-end, implementing Clean Architecture for federal tax case management workflows.

## Architecture

DAWSON is a monorepo with three primary source trees, organized as concentric Clean Architecture layers (see [docs/clean-architecture.md](docs/clean-architecture.md)):

- [shared/src/business/](shared/src/business/) — inner layers; pure domain logic.
  - `entities/` — Joi-validated domain entities.
  - `useCases/` — interactors, named `*Interactor.ts`, take an `applicationContext` and a params object; they never `import` persistence/AWS directly.
  - `useCaseHelper/`, `utilities/` — shared logic re-used across interactors.
- [web-api/src/](web-api/src/) — back-end "frameworks & drivers" + Lambda entrypoints.
  - [`lambdas/`](web-api/src/lambdas/) — HTTP handlers grouped by resource. Wired via [`genericHandler.ts`](web-api/src/genericHandler.ts) / [`lambdaWrapper.ts`](web-api/src/lambdaWrapper.ts).
  - [`persistence/`](web-api/src/persistence/) — gateway implementations: `dynamo/`, `elasticsearch/`, `s3/`, `ses/`, `sqs/`, `cognito/`, `postgres/` (Kysely + migrations under `postgres/utils/migrate/`).
  - [`applicationContext.ts`](web-api/src/applicationContext.ts), `getPersistenceGateway.ts`, `getUseCases.ts`, `getDocumentGenerators.ts` — DI wiring.
- [web-client/src/](web-client/src/) — React + Cerebral SPA (private app `app.tsx`, public app `appPublic.tsx`).
  - [`presenter/sequences/`](web-client/src/presenter/sequences/) — Cerebral sequences named `*Sequence.ts`.
  - [`presenter/actions/`](web-client/src/presenter/actions/) — actions named `*Action.ts(x)` (often paired with `*Action.test.ts`).
  - [`presenter/computeds/`](web-client/src/presenter/computeds/), `presenter/state.ts`, `router.ts`. To map a feature description ("Trial Session page", "Sign Stipulated Decision", "Upload File page") to code, start at [`web-client/src/router.ts`](web-client/src/router.ts) (the URL→component map, anchored on `BASE_ROUTE`) and grep the page heading text against [`web-client/src/views/`](web-client/src/views/).
  - [`views/`](web-client/src/views/), [`ustc-ui/`](web-client/src/ustc-ui/), [`dawson-ui/`](web-client/src/dawson-ui/) — components (USWDS + Tailwind + shadcn-style primitives).
  - [`applicationContext.ts`](web-client/src/applicationContext.ts) / `applicationContextPublic.ts` — DI for the browser. Keep method signatures in sync with the API context.

plus:

- [types/](types/) — top-level ambient `.d.ts`.
- [aws/](aws/), [web-api/terraform/](web-api/terraform/) — infrastructure (Terraform applyables for `blue`/`green` deploys, lambdas under `aws/lambdas/`).

Data flow: React view → Cerebral sequence → action → API call → Lambda handler → interactor → entity validation + persistence gateway → PostgreSQL / OpenSearch / S3 / SES / SQS / DynamoDB.

## Developer workflows

NodeJS, npm (see [package.json](package.json) `engines`). All commands run from repo root.

- Local API: `npm run start:api`, or to resume without re-seed: `npm run start:api:resume`.
- Local clients:
  - Client (private UI on `:1234`): `npm run start:client`.
  - Public (public UI on `:5678`): `npm run start:public`.
- Local stack: run API + private and public clients on separate terminal sessions.
- Local stack (CI): `npm run start:all:ci` (no scanner, no Cognito, in-memory DynamoDB).
- Local stack (Docker): `npm run start:all:docker`.
- Build: `npm run build:all` → [`esbuild.config.mjs`](esbuild.config.mjs); public build via [`esbuild.public.config.mjs`](esbuild.public.config.mjs).
- Lint: `npm run lint`. Single file: `npm run lint:file -- path/to/file.ts`.
  - ESLint: `npm run lint:js/ts` via [`eslint.config.mjs`](eslint.config.mjs) + custom rules in [`eslint-custom-rules/`](eslint-custom-rules/).
  - Stylelint: `npm run lint:css` via [`stylelint.config.js`](stylelint.config.js).
  - Swagger: `npm run lint:swagger` via Swagger CLI validation.
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
- Type-check without emitting: `npx tsc --noEmit -p tsconfig.json` (no dedicated npm script; ESLint + Jest are the primary type gates in CI).
- Cypress: dispatched via [`scripts/run-cypress.sh`](scripts/run-cypress.sh) against configs `cypress.config.ts`, `cypress-public.config.ts`, `cypress-smoketests*.config.ts`, `cypress-real-user-tests.config.ts`. Specs live under [`cypress/`](cypress/) (`deployed-and-local/`, `local-only/`, `readonly/`, `real-users/`).
  - Integration: `npm run cypress:integration` (headless) or `npm run cypress:integration:open` (headed). Single file: `npm run cypress:integration:file -- path/to/file.cy.ts`.
  - Integration (Public): `npm run cypress:integration:public` (headless) or `npm run cypress:integration:public:open` (headed). Single file: `npm run cypress:integration:public:file -- path/to/file.cy.ts`.
  - Read-only: `npm run cypress:readonly` (headless) or `npm run cypress:readonly:open` (headed). Single file: `npm run cypress:readonly:file -- path/to/file.cy.ts`.
  - Read-only (Public): `npm run cypress:readonly:public` (headless) or `npm run cypress:readonly:public:open` (headed). Single file: `npm run cypress:readonly:public:file -- path/to/file.cy.ts`.
  - Smoke tests: `npm run cypress:smoketests` (headless) or `npm run cypress:smoketests:open` (headed). Single file: `npm run cypress:smoketests:file -- path/to/file.cy.ts`.
  - Real-user tests: `npm run cypress:real-user-tests` (headless) or `npm run cypress:real-user-tests:open` (headed).
- Postgres migrations: `npm run migration:generate:postgres`, `migration:postgres`, `migration:rollback:postgres` (Kysely; sources in [`web-api/src/persistence/postgres/utils/migrate/`](web-api/src/persistence/postgres/utils/migrate/)).
- Reindex OpenSearch: [`./reindex-elasticsearch.sh`](reindex-elasticsearch.sh). Reset local data: [`./clear-env.sh`](clear-env.sh) (`npm run reset-cases`).
- Stack readiness (required before Cypress and `test:client:_integration`):
  - Probe ports before starting anything: API `http://localhost:4000/api/swagger`, OpenSearch `http://localhost:9200/`, private UI `http://localhost:1234/`, public UI `http://localhost:5678/`. A 200/401 from any of these means that service is **already running** — do not re-start it.
  - To wait for the API + OpenSearch to come up after a fresh start: `./wait-until-services.sh`.
  - One-shot stack for headless test runs: `npm run start:all:ci`. For interactive iteration, leave the operator's `start:api` / `start:client` / `start:public` sessions in place and prefer `start:api:resume` to skip re-seeding.

## Project-specific conventions

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
- Error handling: ensure that all errors always make their way to an end user if an end user initiated the action in the application.
- `CHANGES.md`: any change that requires a manual deployment step (env-var, container bump, migration ordering, reindex, schema change) gets a new `<details><summary>…</summary>` block prepended to [`CHANGES.md`](CHANGES.md). Mirror the same notes in the PR description.
- Postgres schema artifacts: any new Kysely migration under [`web-api/src/persistence/postgres/utils/migrate/`](web-api/src/persistence/postgres/utils/migrate/) must be paired with updates to [`docs/postgres/schema/data-dictionary.csv`](docs/postgres/schema/data-dictionary.csv) (column-level documentation) and [`docs/postgres/schema/erd.mmd`](docs/postgres/schema/erd.mmd) (Mermaid ERD).
- Local seeded users: the canonical fixture is [`web-api/storage/fixtures/seed/users.json`](web-api/storage/fixtures/seed/users.json), loaded into Cognito-local by [`.cognito/seedCognitoLocal.ts`](.cognito/seedCognitoLocal.ts) and re-exported for unit/integration tests via [`shared/src/test/mockUserTokenMap.ts`](shared/src/test/mockUserTokenMap.ts). Use these emails (paired with the `loginAs*` helpers in Cypress) to reproduce role-specific bugs in the local UI; do not invent test users.
- Local sample documents/PDFs live under [`shared/test-assets/`](shared/test-assets/) and [`web-api/storage/fixtures/`](web-api/storage/fixtures/). For bugs that require a customer-supplied "afflicted" PDF that is not in-repo, request the asset from the operator before claiming a reproduction.
- Tests: Jest unit tests live next to the source (`*.test.ts(x)`); use the project-specific config (`jest --config …`) — running bare `jest` will not pick up the right roots. The `test:api` / `test:shared` / `test:document-generation` scripts already invoke `npm run build:assets` (which runs [`shared/createModule.js`](shared/createModule.js)) for you; only run it manually if invoking Jest directly.
- Pre-commit: Husky + [`lint-staged.config.js`](lint-staged.config.js) runs ESLint, Prettier, Stylelint, and shellcheck. `.shellcheckignore` controls shell linting scope.
- Path aliases come from [`tsconfig.json`](tsconfig.json) and are mapped into Jest via [`utils/load-tsconfig-paths.mjs`](utils/load-tsconfig-paths.mjs).

## Integration points

- AWS (SDK v3): API Gateway, Lambda, DynamoDB ([`@aws-sdk/util-dynamodb`](web-api/src/persistence/dynamo/)), S3 (incl. presigned posts), SES/SESv2, SQS, SNS, Cognito Identity Provider, OpenSearch, CloudFront, Route53, SSM, Batch, RDS Signer (IAM auth to Postgres).
- OpenSearch via [`@opensearch-project/opensearch`](web-api/src/persistence/elasticsearch/) — search, advanced order/opinion search, reindex cron (`web-api/terraform/applyables/reindex-cron`).
- Postgres via [Kysely](web-api/src/persistence/postgres/) with managed migrations; local Postgres is provided by `docker-compose.yml`.
- Local AWS emulation: [s3rver](package.json) (`npm run start:s3rver`), [cognito-local](.cognito/), local DynamoDB and Elasticsearch directories ([`.elasticsearch/`](.elasticsearch/)).
- PDF pipeline: `pdf-lib`, `pdfjs-dist`, `pug` templates, `@sparticuz/chromium` + Puppeteer for headless rendering in Lambda; generators under [`shared/src/business/utilities/documentGenerators/`](shared/src/business/utilities/documentGenerators/).
- Scanner integration: DynamSoft `dwt` (disable locally with `NO_SCANNER=true`, already set in `test:_client` and `start:client:no-scanner`).
- Front-end framework: Cerebral (forked `@cerebral/react` from `ustaxcourt/cerebral-react`), React, USWDS, Tailwind, Radix primitives, Quill rich text, react-select.
- Auth: Cognito with custom authorizers under [`web-api/src/lambdas/cognitoAuthorizer/`](web-api/src/lambdas/cognitoAuthorizer/) and [`publicApiAuthorizer/`](web-api/src/lambdas/publicApiAuthorizer/); JWT via `jsonwebtoken`.
- CI/CD: CircleCI ([`.circleci/`](.circleci/)) drives blue/green Terraform deploys (`npm run deploy:blue` / `deploy:green` / `deploy:allColors`); environment branches `develop` → `test` → `staging` → `prod` (+ `irs`).
- Observability: Winston logger ([`web-api/src/createLogger.ts`](web-api/src/createLogger.ts)), AWS RUM (`aws-rum-web`) on the client, Logs→ES indexing via [`aws/lambdas/LogsToElasticSearch_info/`](aws/lambdas/LogsToElasticSearch_info/).

## Agent expectations

- Test coverage: every code change must ship with unit tests in the suite that owns the file (see "Test-suite ownership" above) and must hit 100% line + branch coverage for the added/modified code. Verify by running the owning full-suite script (which emits `--coverage` by default) and inspecting `./coverage/lcov-report/index.html` (or `coverage/clover.xml` / `coverage-final.json`) for the changed files. The `*:file` variants skip coverage and are only suitable for fast iteration, not for the final coverage check.
- Exempt from new unit tests: pure documentation (`docs/**`, `*.md`), Terraform-only changes (`web-api/terraform/**`, `web-client/terraform/**`), CircleCI config (`.circleci/**`), and dependency-only `package*.json` bumps. Everything else (including shell scripts under `scripts/` and `aws/lambdas/`) needs tests in its owning suite.
- Cypress coverage: any user-facing change requires Cypress specs under [`cypress/`](cypress/) that exercise every applicable role. Use the canonical role helpers in [`cypress/helpers/authentication/login-as-helpers.ts`](cypress/helpers/authentication/login-as-helpers.ts) (`loginAs*`).
- Accessibility: all UI must satisfy Section 508 and WCAG 2.1 AA. Verify by adding/extending a Cypress spec that calls the shared [`checkA11y`](cypress/local-only/support/generalCommands/checkA11y.ts) helper (built on `cypress-axe` + `axe-core`); see [`cypress/local-only/tests/accessibility/`](cypress/local-only/tests/accessibility/) for exemplar specs. Prefer existing accessible primitives in [`ustc-ui/`](web-client/src/ustc-ui/) and [`dawson-ui/`](web-client/src/dawson-ui/); preserve semantic HTML, label associations, focus order, and keyboard operability.
- Out-of-repo Definition-of-Done items (TestRail test runs, validation in the Court's test environment, user-guide updates, screen-reader spot-checks): the agent cannot complete these from this environment. Surface every applicable item in the PR description and in the hand-off back to the operator with the exact action requested — do not silently leave DoD checkboxes unchecked.
- Visual PDF tests: there is no in-repo visual-snapshot helper for generated PDFs today (no `jest-image-snapshot` / `toMatchPdfSnapshot` wiring). If a ticket DoD requires "visual tests for newly added PDFs," flag the gap to the operator before submitting rather than fabricating one — the existing coverage path is `test:document-generation` against fixtures under [`shared/test-assets/`](shared/test-assets/).
- Cerebral state debugging: for "list/data disappears after a sequence runs" bugs, inspect the action chain in the relevant `*Sequence.ts`, the state shape in [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts), and the action that runs on modal close — these bugs are usually a missing re-fetch or a state path being cleared without being re-populated.
- Pre-verification hygiene: before declaring work ready, run `npm run lint:fix` **and then** `npm run lint` to confirm a clean exit code (auto-fix silently leaves non-fixable violations behind). Do not bypass these tools or hand-format around them. The same gates run via Husky + [`lint-staged.config.js`](lint-staged.config.js) on commit.
- TypeScript discipline: annotate function parameters and return types; do not rely on inference where an explicit annotation is possible. Prefer type annotations over assertions; do not use `as any` or non-null `!` assertions to silence the type checker — fix the underlying type. Confirm the change type-checks with `npx tsc --noEmit -p tsconfig.json` if Jest/ESLint do not already exercise the file.
- Styling: prefer Tailwind utility classes with the `tw:` prefix (e.g. `className="tw:flex tw:mt-4"`, see [`web-client/src/views/Login/Login.tsx`](web-client/src/views/Login/Login.tsx)) over USWDS classes when both are viable; reserve USWDS classes for component patterns that depend on USWDS behavior/markup.
- Local stack required for E2E/integration: Cypress and `test:client:_integration` assume the local API + clients are reachable. Before invoking them, probe the ports listed under "Stack readiness"; only start what is missing (do not re-launch a stack the operator already has running) and then `./wait-until-services.sh` until the API and OpenSearch respond.
- Verification honesty: never report a bug "fixed" or an issue "resolved" without executing the verifying command/test and capturing concrete evidence — the exact command, its exit code, and the relevant stdout lines (or, for UI changes, the URL exercised, the role used, and a screenshot or DOM excerpt). When verification is not possible from the agent's environment (e.g. browser-based, deployed, or role-gated checks), give the operator the exact command(s) to run and name the specific output you need back (e.g. "paste the final 20 lines of the Cypress run summary" or "the network response status for `POST /cases`") before continuing.
- Source control: do not run `git commit` (or any pushing/tagging) unless the operator explicitly asks. When proposing commits:
  - Group files by functional intent — one commit per logical change; do not co-mingle unrelated edits.
  - Format messages as `<PREFIX>: <concise description>` — colon-space between prefix and summary. Resolve `<PREFIX>` in this order: (1) the value the operator provided in chat, otherwise (2) the task slug embedded in the current git branch name (e.g. `DAW-1234` or `9809-change-of-address-job-notification-update` from `git rev-parse --abbrev-ref HEAD`), otherwise (3) the open pull request number from `gh pr view --json number,headRefName`, otherwise (4) a short scope tag matching repo precedent (`devex:`, `deps:`, `docs:`) when the change does not map to a single ticket — verify by `git log --oneline -20` to match existing convention. If none of (1)–(4) clearly apply, ask the operator for the prefix before drafting commit messages — do not invent or substitute a placeholder.
- Scratch files: write throwaway scripts, fixtures, and debug output under `/tmp` (or delete them in the same turn). Never leave temporary artifacts in the working tree where they could be staged or committed by accident.
- Communication: when asking the operator questions, be concise but provide sufficient context to avoid back-and-forth. When providing instructions, be explicit and step-by-step to ensure clarity.
