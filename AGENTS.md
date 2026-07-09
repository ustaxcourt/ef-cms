# DAWSON: United States Tax Court's Electronic Filing & Case Management System

This is DAWSON, the United States Tax Court's electronic filing and case management system, a TypeScript/React + Cerebral.js front-end and AWS Lambda back-end, implementing Clean Architecture for federal tax case management workflows.

## Directory-Specific Guidance

Each major directory contains its own `AGENTS.md` with conventions, naming rules, and sources of truth specific to that layer:

- [`shared/AGENTS.md`](shared/AGENTS.md) — Clean Architecture, entities, interactors, domain utilities, document generation.
- [`web-api/AGENTS.md`](web-api/AGENTS.md) — Lambda handlers, persistence (Postgres/OpenSearch), logging, async work, feature flags.
- [`web-client/AGENTS.md`](web-client/AGENTS.md) — React + Cerebral conventions, component libraries, styling, accessibility.
- [`cypress/AGENTS.md`](cypress/AGENTS.md) — E2E testing, role helpers, accessibility testing, Cypress commands.

## Project Overview

DAWSON is a monorepo with three primary source trees, organized as concentric Clean Architecture layers (see [docs/clean-architecture.md](docs/clean-architecture.md)):

- [shared/src/business/](shared/src/business/) — inner layers; pure domain logic.
- [web-api/src/](web-api/src/) — back-end "frameworks & drivers" + Lambda entrypoints.
- [web-client/src/](web-client/src/) — React + Cerebral SPA (private app `app.tsx`, public app `appPublic.tsx`).

Data flow: React view → Cerebral sequence → action → API call → Lambda handler → interactor → entity validation + persistence gateway → PostgreSQL / OpenSearch / S3 / SES / SQS / DynamoDB.

### Running, Linting, and Testing the Application

- `.devcontainer`: start a pre-configured codespace container with all dependencies pre-installed. When running as an agent inside the `.devcontainer`, the application DOES NOT start automatically. You must start the stack by running `npm run start:api`, `npm run start:client`, and `npm run start:public` in separate terminal sessions, or you can run `npm run start:all:ci` if you just need a headless stack for integration tests (no scanner, no Cognito).
- Lint: `npm run lint`. This runs all linters in one command, but you can also run them separately.
  - ESLint: `npm run lint:js/ts` via [`eslint.config.mjs`](eslint.config.mjs) + custom rules in [`eslint-custom-rules/`](eslint-custom-rules/). Single file: `npm run lint:js/ts:file -- path/to/file.ts`.
  - Stylelint: `npm run lint:css` via [`stylelint.config.js`](stylelint.config.js). Single file: `npm run lint:css:file -- path/to/file.scss`.
  - Swagger: `npm run lint:swagger` via Swagger CLI validation. Single file: `npm run lint:swagger:file -- path/to/file.yaml`.
  - Auto-fix: `npm run lint:fix`.
- Unit tests (Jest, jsdom): Aggregate config via [`jest.config.ts`](jest.config.ts). Single file: `npm run test:file -- path/to/file.test.ts`. The full-suite scripts below run with `--coverage` by default and write reports to `./coverage/`; the `*:file` variants disable coverage.
  - API: `npm run test:api`. Single file: `npm run test:api:file -- path/to/file.test.ts`.
  - Client: `npm run test:client:unit`. Single file: `npm run test:client:unit:file -- path/to/file.test.ts`.
  - Client integration (Cerebral): `npm run test:client:_integration`. Single file: `npm run test:client:integration:file -- path/to/file.test.ts`. Requires the local stack.
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
- Cypress: see [`cypress/AGENTS.md`](cypress/AGENTS.md) for full details on running specs, suites, and commands.

### Cross-Cutting Conventions

- Three `applicationContext` implementations exist (web-api, web-client private, web-client public).
- Error handling: ensure that all errors always make their way to an end user if an end user initiated the action in the application.
- `CHANGES.md`: any change that requires a manual step (pre-deployment script, local environment configuration change, etc.) gets a new `<details><summary>…</summary>` block prepended to [`CHANGES.md`](CHANGES.md). Mirror the same notes in the PR description.
- Path aliases: [`tsconfig.json`](tsconfig.json), mapped into Jest via [`utils/load-tsconfig-paths.mjs`](utils/load-tsconfig-paths.mjs).
- Build & CI/CD:
  - Bundle entrypoints: [`esbuild.config.mjs`](esbuild.config.mjs) (private) and [`esbuild.public.config.mjs`](esbuild.public.config.mjs) (public).
  - CI/CD gates: GitHub Actions on all PRs to protected branches: [`.github/workflows/`](.github/workflows/).
  - Deployments: CircleCI: [`.circleci/config.yml`](.circleci/config.yml).
  - Client-side error reporting is not yet implemented (planned via AWS RUM).

## Agent Expectations

### General Expectations

- Test coverage: every code change must ship with unit tests in the suite that owns the file (see "Test-suite ownership" above) and must hit 100% line + branch coverage for the added/modified code (or as close as possible). Verify by running the owning full-suite script (which emits `--coverage` by default) and inspecting `./coverage/lcov-report/index.html` (or `coverage/clover.xml` / `coverage-final.json`) for the changed files. The `*:file` variants skip coverage and are only suitable for fast iteration, not for the final coverage check.
  - Exempt from new unit tests: pure documentation (`docs/**`, `*.md`), Terraform-only changes (`web-api/terraform/**`, `web-client/terraform/**`), and CircleCI config (`.circleci/**`). Everything else (including shell scripts under `scripts/` and `aws/lambdas/`) needs tests in its owning suite.
- Cypress coverage: any user-facing change requires Cypress specs under [`cypress/`](cypress/) that exercise every applicable role. Use the canonical role helpers in [`cypress/helpers/authentication/login-as-helpers.ts`](cypress/helpers/authentication/login-as-helpers.ts) (`loginAs*`).
- Accessibility: all UI must satisfy Section 508 and WCAG 2.1 AA. Verify by adding/extending a Cypress spec that calls the shared [`checkA11y`](cypress/local-only/support/generalCommands/checkA11y.ts) helper (built on `cypress-axe` + `axe-core`); see [`cypress/local-only/tests/accessibility/`](cypress/local-only/tests/accessibility/) for exemplar specs. Prefer existing accessible primitives in [`ustc-ui/`](web-client/src/ustc-ui/) and [`dawson-ui/`](web-client/src/dawson-ui/); preserve semantic HTML, label associations, focus order, and keyboard operability.
- Visual PDF tests: if a ticket DoD requires "visual tests for newly added PDFs," do not fabricate a snapshot tool or claim one doesn't exist. DAWSON uses a custom image diffing utility (`generateAndVerifyPdfDiff`) in `shared/src/business/utilities/documentGenerators/generateAndVerifyPdfDiff.ts` that relies on `pdf2pic` and `pixelmatch`. Refer to existing `*.test.ts` files in that folder for usage examples.
- Test best practices: 
  - Any `it()` block should be able to run in isolation, without relying on data, state, or side effects of other tests.
  - Never wait for a fixed time interval; instead, wait for a deterministic condition to be met.
- Cerebral state debugging: for "list/data disappears after a sequence runs" bugs, inspect the action chain in the relevant `*Sequence.ts`, the state shape in [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts), any relevant computed under [`web-client/src/presenter/computeds/`](web-client/src/presenter/computeds/), and the action that runs on modal close — these bugs are usually a missing re-fetch or a state path being cleared without being re-populated.
- Pre-verification hygiene: before declaring work ready, lint all added and modified files, fixing errors as necessary, and then run `npx prettier --write <files/globs>` to format code based on the project's prettier configuration. Do not bypass these tools or hand-format around them.
- TypeScript discipline: annotate function parameters and return types; do not rely on inference where an explicit annotation is possible. Prefer type annotations over assertions; do not use `as any` or non-null `!` assertions to silence the type checker — fix the underlying type. Confirm the change type-checks with `npx tsc --noEmit -p tsconfig.json` if Jest/ESLint do not already exercise the file.
- Styling: prefer Tailwind utility classes with the `tw:` prefix (e.g. `className="tw:flex tw:mt-4"`, see [`web-client/src/views/Login/Login.tsx`](web-client/src/views/Login/Login.tsx)) over USWDS classes when both are viable; reserve USWDS classes for component patterns that depend on USWDS behavior/markup.
- Local stack required for E2E/integration: Cypress and `test:client:_integration` assume the local API + clients are reachable.
  - Probe ports before starting anything: API `http://localhost:4000/api/swagger`, OpenSearch `http://localhost:9200/`, private UI `http://localhost:1234/`, public UI `http://localhost:5678/`. A 200/401 from any of these means that service is **already running**.
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
- **Terminal buffer limitations!** The interactive shell has an input buffer character limit (often 1024 characters). Avoid using `cat << 'EOF' > ...`, `echo -e`, or `node -e "..."` to write large scripts or long strings directly via terminal injection. Exceeding the buffer limit will drop characters, mangle syntax, and trap the session in a broken `heredoc` sequence. Instead, ALWAYS use dedicated file system tools (e.g., `create_file` or `insert_edit_into_file`) to construct or modify files larger than ~20 lines.
- Out-of-repo Definition-of-Done items (TestRail test runs, validation in the Court's test environment, user-guide updates, screen-reader spot-checks): the agent cannot complete these from this environment. Surface every applicable item in the PR description and in the hand-off back to the operator with the exact action requested — do not silently leave DoD checkboxes unchecked.
- Scratch files: feel free to write throwaway scripts, fixtures, and capture debug output to local files within the working tree, so long as they are deleted before finishing or aborting a task. Never leave temporary artifacts in the working tree where they could be staged or committed by accident.
- Running the application: Before running the application, probe the ports to see if the application is already running. Prefer to leave the operator's `start:api` / `start:client` / `start:public` sessions in place and prefer `start:api:resume` to skip re-seeding.
- Deployed environments: operators will have local configuration enabling them to connect to and interact with deployed DAWSON environments. **NEVER connect to a deployed environment from an agent session.** If a reproduction requires interaction with a deployed environment, ask the operator to execute the necessary steps in a session that the agent can not access and share the relevant output.
- Communication: when asking the operator questions, be concise but provide sufficient context to avoid back-and-forth. When providing instructions, be explicit and step-by-step to ensure clarity.
- Verification: when verification is not possible from the agent's environment (e.g. browser-based, deployed, or role-gated checks), give the operator the exact command(s) to run and name the specific output you need back (e.g. "paste the final 20 lines of the Cypress run summary" or "the network response status for `POST /cases`") before continuing.

### Code Review Guidelines

When performing code review, flag violations of the following:

- **Acceptance Criteria**: Examine the original ticket or task in detail, examine all added and modified code, and assert that all acceptance criteria have been met.
- **TypeScript Discipline**: Flag the use of `as any`, non-null assertions (`!`), or missing return type annotations.
- **Missing Test Coverage**: If a source file is modified but its corresponding `*.test.ts` (or `*.cy.ts` for UI) is absent from the PR, remind the author that 100% line/branch coverage and Cypress role permutations are required by `AGENTS.md`.
- **Clean Architecture Violations**: Reject any change that imports `web-api/`, `web-client/`, AWS SDKs, or persistence modules into `shared/src/business/`.
- **Missing Migrations Documentation**: If `web-api/src/persistence/postgres/utils/migrate/` has new files, verify `docs/postgres/schema/data-dictionary.csv` and `docs/postgres/schema/erd.mmd` are also updated.
- **Interactor Ordering**: Reject if an interactor persists an entity before successfully validating it via `JoiValidationEntity`.
- **Validate Before Persist (entities)**: Beyond interactor ordering, flag any code path that constructs a non-`JoiValidationEntity` ad-hoc object and writes it directly to a persistence gateway, bypassing the validation surface entirely.
- **Styling**: Flag new usages of USWDS utility classes if a Tailwind equivalent with the `tw:` prefix could be used.
- **Linting and Formatting**: Check the diff for ESLint, Stylelint, Shellcheck, and Prettier inconsistencies.
- **Safe Migrations**: Flag any Postgres migration under `web-api/src/persistence/postgres/utils/migrate/` that destructively modifies tables or columns currently in use. Because DAWSON uses zero-downtime blue/green deployments, the "active" color is still running while migrations execute on the "passive" color. Suggest the expand/contract pattern for any destructive schema changes.
- **Endpoint Documentation**: If a change adds, removes, or alters the signature of an HTTP endpoint without a corresponding update to `web-api/swagger.json`, flag it.
- **Browser-Only Code in `shared/`**: Flag any import of `window`, `document`, DOM APIs, React, Cerebral, or other browser/runtime-specific modules from within `shared/`. Such code belongs in `web-client/` (or, for public-only code, gated to the public app).
- **`genericHandler` Usage**: Flag any new or modified `*Lambda.ts` under `web-api/src/lambdas/` that does not wrap its handler with `genericHandler` (the auth/error/CORS contract). New Lambdas should also be questioned on principle — prefer extending an existing handler/interactor.
- **Logging Discipline**: Flag `console.log` / `console.error` calls in `web-api/` Lambda or interactor code; require the Winston wrapper (`getDawsonLogger`). Also flag any log statement that appears to emit raw user PII, document contents, or application secrets.
- **Date/Time Imports**: Flag direct imports of `luxon`, `date-fns`, `moment`, or hand-rolled `new Date()` arithmetic in business logic; require `DateHandler`.
- **Cerebral State Discipline**: Flag any new top-level state path used in actions/computeds/views that is not declared in [`web-client/src/presenter/state.ts`](web-client/src/presenter/state.ts). Also flag sequences that clear a state path without an action that re-populates it before the user sees an empty list.
- **Naming Conventions**: Flag files whose names diverge from the documented patterns (`verbNounInteractor.ts`, `verbNounAction.ts(x)`, `verbNounSequence.ts`, `*Lambda.ts`, PascalCase entity classes) or that are missing their co-located `*.test.ts`.
- **Error Surfacing**: Flag swallowed errors (empty `catch`, `catch` that only logs, promise chains without rejection handling) on user-initiated paths. Errors from user actions must reach the end user.
- **Accessibility Coverage**: For any user-facing change, flag the absence of (or failure to extend) a Cypress spec that calls `checkA11y` on the affected view, and flag regressions in semantic HTML, label associations, focus order, or keyboard operability.
- **Cypress Role Permutations**: For role-gated UI changes, flag the absence of Cypress coverage exercising every applicable role via `loginAs*` helpers.
- **Visual PDF Tests**: Flag new or materially altered PDF generators under `shared/src/business/utilities/documentGenerators/` that ship without a `generateAndVerifyPdfDiff`-based snapshot test.
- **`CHANGES.md` Callout**: Flag any change requiring a manual step (pre-deployment script, local environment configuration change, etc.) that lacks a new `<details>` block prepended to `CHANGES.md` and mirrored in the PR description.
- **Public vs. Private Surface**: Flag additions to `app.tsx` / `applicationContext.ts` / `web-api/src/lambdas/` that should have landed on the public counterparts (`appPublic.tsx` / `applicationContextPublic.ts` / `public-api/`), or vice versa.
- **Test Quality, Not Just Coverage**: Beyond coverage, flag tests that achieve coverage without meaningful assertions (snapshot-only on logic, asserting only that a mock was called without verifying arguments, tests that pass against both the buggy and fixed implementation, etc.).
- **Interdependent Tests**: Flag tests that rely on the state, data, or side effects of other tests. Each `it()` block should be able to run in isolation.
- **Secrets and Fixtures**: Flag any committed credentials, API keys, JWTs, or real PII in fixtures, tests, or logs. Use the seeded users and test assets already in the repo.
- **Dependency Hygiene**: Flag new runtime dependencies added without justification in the PR description, especially when an existing utility already covers the use case. Dependencies must be pinned to specific versions; flag any dependency not pinned to a specific version.
