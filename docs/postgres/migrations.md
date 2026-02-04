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

## Heavy Migrations (Disabling Transactions)

Some migrations need to run outside of a database transaction to allow for proper autocommit behavior. This is particularly important for:
- Large data backfill operations that need to commit in batches
- Long-running migrations that could hold locks for extended periods
- Migrations that use explicit lock timeouts and statement timeouts

To create a heavy migration, add `.heavy` to the migration filename (e.g., `2025-11-11T16_55_01Z-s3-refactor-2.heavy.ts`).

The migration runner in `migrate.ts` will automatically detect the `.heavy` suffix and create a migrator with `disableTransactions: true`. This allows the migration to:
- Batch reads into configurable chunks and autocommit writes as the migration runs
- Optionally implement custom transactions within the migration (these would otherwise be wrapped in the Kysely migration transaction)
- Implement custom pause/retry logic between batches
- Set custom lock and statement timeouts within the migration

Special care should be taken if migrations are not easily reversible or remove/transform data. Standard migrations will not apply changes if an issue occurs during migration, a `.heavy` will. 

**Example heavy migration pattern:**
```typescript
export async function up(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 5_000;
  const PAUSE_MS = 250;
  
  await sql`set lock_timeout = '2s'`.execute(db);
  await sql`set statement_timeout = '10min'`.execute(db);
  
  while (true) {
    // Process batch with FOR UPDATE SKIP LOCKED
    const batch = await db
      .selectFrom('table')
      .where('column', 'is', null)
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();
      
    if (batch.length === 0) break;
    
    // Update batch (autocommits after each batch)
    await db.updateTable('table').set({ column: value }).execute();
    
    // Pause between batches
    await new Promise(r => setTimeout(r, PAUSE_MS));
  }
}
```

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