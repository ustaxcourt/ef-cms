# web-api/ — Backend Layer

This directory contains DAWSON's backend: AWS Lambda handlers, persistence gateways, and the server-side `applicationContext`. It is the outermost "frameworks & drivers" layer of the Clean Architecture.

## Lambda Handlers

- Naming: `*Lambda.ts` under [`src/lambdas/`](src/lambdas/).
- Every Lambda must wrap its handler with `genericHandler` for auth/error/CORS.
- Adding a **new** Lambda requires coordinated Terraform and routing changes — prefer extending an existing handler/interactor over introducing a new Lambda.

## HTTP Surface

- OpenAPI spec: [`swagger.json`](swagger.json), plus versioned docs [`../docs/api/v1.yaml`](../docs/api/v1.yaml) and [`../docs/api/v2.yaml`](../docs/api/v2.yaml).
- Any addition, removal, or signature change to an HTTP endpoint must be reflected in `swagger.json`; verify with `npm run lint:swagger`.

## Persistence — PostgreSQL

- Schema: [`src/persistence/postgres/database-schema.ts`](src/persistence/postgres/database-schema.ts).
- Migrations: [`src/persistence/postgres/utils/migrate/`](src/persistence/postgres/utils/migrate/).
- Documentation: [`../docs/postgres/schema/data-dictionary.csv`](../docs/postgres/schema/data-dictionary.csv) and [`../docs/postgres/schema/erd.mmd`](../docs/postgres/schema/erd.mmd).
- **Query generation**: DAWSON uses Kysely.
- **Zero-downtime migrations**: DAWSON uses blue/green deployments where the "active" environment remains running while the "passive" deploys. Migrations must never destructively modify tables or columns that the active color relies on. For destructive schema changes, use the **expand/contract pattern**.
- **Schema artifacts**: any new migration must be paired with updates to `data-dictionary.csv` and `erd.mmd`.

## Persistence — OpenSearch

- Indices and analyzers: [`elasticsearch/`](elasticsearch/).
- Reindexes run automatically when mappings change (see [`.circleci/config.yml`](../.circleci/config.yml)); no `CHANGES.md` callout is needed for the reindex itself.

## Logging

- Server-side logger: Winston, configured in [`src/createLogger.ts`](src/createLogger.ts) and wrapped by [`src/utilities/logger/getDawsonLogger.ts`](src/utilities/logger/getDawsonLogger.ts).
- **Use the wrapper**; do not call `console.log` or `console.error` from Lambda or interactor code.
- Do not log raw user PII, document contents, or application secrets.

## Asynchronous Work

- Purpose-specific queues: [`terraform/modules/api/sqs.tf`](terraform/modules/api/sqs.tf), [`terraform/modules/api/change-of-address.tf`](terraform/modules/api/change-of-address.tf), and [`terraform/modules/opensearch-sync/opensearch-sync.tf`](terraform/modules/opensearch-sync/opensearch-sync.tf).
- Worker queue: a single SQS queue dispatched by [`src/gateways/worker/workerRouter.ts`](src/gateways/worker/workerRouter.ts). New asynchronous work that does not need its own concurrency, log group, error handling, or alerting can be routed through this router.

## Feature Flags

- Persisted in Postgres ([`src/persistence/postgres/featureFlag/schema.ts`](src/persistence/postgres/featureFlag/schema.ts)).
- Cached per-runner on first read by [`../shared/src/business/useCases/featureFlag/getAllFeatureFlagsInteractor.ts`](../shared/src/business/useCases/featureFlag/getAllFeatureFlagsInteractor.ts).

## Observability

- CloudWatch alarms under [`terraform/modules/api/alarms.tf`](terraform/modules/api/alarms.tf) and [`terraform/modules/health-alarms/`](terraform/modules/health-alarms/). When adding a long-running or always-on background workflow, consider whether a paired alarm is warranted.

## Fixtures & Seeded Users

- Canonical seeded users fixture: [`storage/fixtures/seed/users.json`](storage/fixtures/seed/users.json), loaded into Cognito-local by [`../.cognito/seedCognitoLocal.ts`](../.cognito/seedCognitoLocal.ts).
- Sample documents/PDFs: [`storage/fixtures/`](storage/fixtures/).
- Use these seeded emails for local reproduction; do not invent test users.

## Testing

- **Test suite**: `npm run test:api` (with coverage). Single file: `npm run test:api:file -- path/to/file.test.ts`.
- **Exception**: `hostedEnvironmentTests/**` → `npm run test:api:hosted-environment`.
- 100% line + branch coverage is required for all added/modified code.
