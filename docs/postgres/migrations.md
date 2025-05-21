# Postgres Migration

Migrations happen automatically and always run if needed. We no longer utilize the migrate flag or alpha/beta setup. Migrations will happen in-place and only a single migration can run at any given time. 

## Creating New Migrations

Migrations are stored in `web-api/src/persistence/postgres/utils/migrate/migrations`. 

We follow the expand and contract method of creating migrations. You can learn more [here](https://planetscale.com/blog/backward-compatible-databases-changes).

Kysely uses up/down pattern for running migrations.

When creating a new migration follow the pattern of <TIMESTAMP>-<migration-description>. Use the migration generator `npm run migration:generate:postgres` to generate a new empty migration file.

Kysely will run migrations in order, so 2025-05-21T15_31_03Z-init, 2025-05-23T15_31_03Z-status-table, etc.

Use the Kysely query builder to add new columns, remove existing columns, and to add indexes.

To learn more about Kysely migrations and syntax, see [here](https://kysely.dev/docs/migrations).

## Running Migrations on Local

```
npm run migration:postgres
```

## Rolling Back Latest Migration on Local

```
npm run migration:rollback:postgres
```