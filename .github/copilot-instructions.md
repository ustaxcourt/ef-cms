# DAWSON — General Code Review Standards

## Purpose

These instructions guide Copilot code review across all files in this repository.
Path-specific rules live in `.github/instructions/`. The canonical reference for
all project conventions, architecture, and agent expectations is `AGENTS.md`.

## Project Overview

DAWSON is the United States Tax Court's electronic filing and case management
system — a TypeScript/React + Cerebral.js front-end with an AWS Lambda back-end,
implementing Clean Architecture.

### Architecture Layers

- `shared/src/business/` — inner layers; pure domain logic (entities, interactors)
- `web-api/src/` — back-end "frameworks & drivers" + Lambda entrypoints
- `web-client/src/` — React + Cerebral SPA (private `app.tsx`, public `appPublic.tsx`)

Data flow: React view → Cerebral sequence → action → API call → Lambda handler →
interactor → entity validation + persistence gateway → PostgreSQL / OpenSearch / S3

## Security

- Never hardcode credentials, API keys, or secrets
- Validate all user inputs at system boundaries
- Use parameterized queries (Kysely) to prevent SQL injection
- Review authentication and authorization logic in every PR

## Error Handling

- Errors from user-initiated actions must always reach the end user
- Do not swallow errors (empty `catch`, `catch` that only logs, unhandled promise rejections)

## Code Quality

- Annotate function parameters and return types in TypeScript
- Do not use `as any` or non-null `!` assertions — fix the underlying type
- Remove dead code and unused imports
- Functions should be focused and appropriately sized

## Naming Conventions

- Interactors: `verbNounInteractor.ts` in `shared/src/business/useCases/`
- Cerebral actions: `verbNounAction.ts(x)` in `web-client/src/presenter/actions/`
- Cerebral sequences: `verbNounSequence.ts` in `web-client/src/presenter/sequences/`
- Entities: PascalCase classes extending `JoiValidationEntity`
- Lambda handlers: `*Lambda.ts` under `web-api/src/lambdas/`
- Each source file must have a co-located `*.test.ts`

## Source Control

- One commit per logical change; do not co-mingle unrelated edits
- Format messages as `<PREFIX>: <concise description>`
- Resolve PREFIX: (1) issue number, (2) branch slug, (3) PR number, (4) scope tag (`devex:`, `deps:`, `docs:`)

## Pre-Verification Hygiene

- Lint all added/modified files before declaring work ready
- Run `npx prettier --write <files>` to format code
- Verify type-checking with `npx tsc --noEmit -p tsconfig.json`

## `CHANGES.md`

- Any change requiring a manual step (pre-deployment script, env config change) gets a `<details>` block prepended to `CHANGES.md` and mirrored in the PR description

## Campsite Rule

- Always leave code "better than you found it" — fix violations of these guidelines whenever practical
