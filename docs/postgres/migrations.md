# Postgres Migration

Migrations happen automatically and always run if needed. We no longer utilize the migrate flag or alpha/beta setup. Migrations will happen in-place and only a single migration can run at any given time. 

## Creating New Non-Expand/Contract Migrations

Migrations are stored in `web-api/src/persistence/postgres/utils/migrate/migrations`. 

We follow the expand and contract method of creating migrations. You can learn more [here](https://planetscale.com/blog/backward-compatible-databases-changes).

Kysely uses up/down pattern for running migrations.

When creating a new migration follow the pattern of <TIMESTAMP>-<migration-description>. Use the migration generator `npm run migration:generate:postgres` to generate a new empty migration file.

Kysely will run migrations in order, so 2025-05-21T15_31_03Z-init, 2025-05-23T15_31_03Z-status-table, etc.

Use the Kysely query builder to add new columns, remove existing columns, and to add indexes.

To learn more about Kysely migrations and syntax, see [here](https://kysely.dev/docs/migrations).

## Creating New Expand/Contract Migrations

For expand migrations: follow the same procedure as above, optionally adding `.expand` in the migration filename. `.expand` migrations will not be treated differently than regular migrations, but will be more easily identifiable. 

For contract migrations: follow the same procedure as above, adding `.contract` to the migration filename. The `.contract` is NOT optional; these migrations will run _after_ the entire deployment has finished. Contract migrations should only _remove_ database tables/schema/data that is no longer referenced in application code.

After expand/contract has finished:
    - If the schema is the same as before starting the entire expand/contract process and only data has changed, move expand/contract migrations to the `deprecated` directory.
    - If the schema has changed during the expand/contract process, leave migrations in place until they can be consolidated with other previously-run migrations

## Deprecated Migrations

The concept of "deprecated" migrations covers data-only migrations that do not _need_ to be run to stand up a new environment, but may still be used to force existing data to be migrated. Migrations moved to the `deprecated` directory will be automatically removed from the Kysely migration table and therefore will not be enforced after being moved.

Deprecated migrations can be run on environments that may have data that needs to be updated by setting the `force_all_migrations` flag to `true` in CircleCi pipeline parameters. This will run all migrations in the deprecated directory at the same time, expanding and contracting at once.


## Running Migrations on Local

```
npm run migration:postgres
npm run migration:postgres:contract
```

## Rolling Back Latest Migration on Local

```
npm run migration:rollback:postgres
```