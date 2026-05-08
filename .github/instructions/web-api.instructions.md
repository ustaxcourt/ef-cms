---
applyTo: "web-api/**"
---

# Web API — Backend Conventions

## Purpose

Rules for the backend "frameworks & drivers" layer: Lambda handlers, persistence
gateways, and infrastructure code.

## Lambda Handlers

- File naming: `*Lambda.ts` under `web-api/src/lambdas/`
- Every handler must be wrapped with `genericHandler` (auth/error/CORS contract)
- Prefer extending an existing handler/interactor over introducing a new Lambda
- New Lambdas require coordinated Terraform and routing changes

## Logging

- Use the Winston wrapper: `getDawsonLogger` from `web-api/src/utilities/logger/getDawsonLogger.ts`
- Never use `console.log` / `console.error` in Lambda or interactor code
- Never log raw user PII, document contents, or application secrets

## Query Generation

- Use Kysely for all query generation
- Use parameterized queries to prevent SQL injection

## HTTP Contract

- Any addition, removal, or signature change to an HTTP endpoint must be reflected
  in `web-api/swagger.json`
- Verify with `npm run lint:swagger`

## Postgres Migrations

- Migrations live in `web-api/src/persistence/postgres/utils/migrate/`
- DAWSON uses blue/green deployments — the "active" environment runs while migrations
  execute on the "passive" environment
- Never destructively modify tables or columns the active color relies on
- Use the expand/contract pattern for destructive schema changes
- Every new migration must be paired with updates to:
  - `docs/postgres/schema/data-dictionary.csv` (column-level documentation)
  - `docs/postgres/schema/erd.mmd` (Mermaid ERD)

## Three `applicationContext` Implementations

- `web-api` has its own applicationContext — do not confuse with the two web-client
  implementations (private and public)

## Observability

- CloudWatch alarms exist under `web-api/terraform/modules/api/alarms.tf`
  and `web-api/terraform/modules/health-alarms/`
- When adding a long-running or always-on background workflow, consider whether
  a paired alarm is warranted

## Asynchronous Work

- Worker queue dispatched by `web-api/src/gateways/worker/workerRouter.ts`
- New async work that doesn't need its own concurrency/log group/alerting can use
  the worker router
- Purpose-specific queues can be provisioned when needed
