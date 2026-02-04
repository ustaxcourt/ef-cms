import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 5_000;
  const PAUSE_MS = 250;
  const LOG_EVERY = 10;

  let total = 0;
  let batches = 0;

  // Fail fast if we can't acquire locks within 2 seconds (avoids blocking other operations)
  await sql`set lock_timeout = '2s'`.execute(db);
  // Allow up to 30 minutes for the entire migration (backfill can take a while)
  await sql`set statement_timeout = '30min'`.execute(db);

  // Add column WITHOUT a default value. This ensures existing rows have NULL,
  // which we use to identify unprocessed rows during backfill.
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('multiDocketedOn', sql`varchar[]`)
    .execute();

  // Create INSERT trigger to handle new docket entries during migration and blue-green deployment.
  // Old code doesn't know about multiDocketedOn, so when it inserts a row, this trigger
  // computes the correct value by finding all docketNumbers sharing the same docketEntryId.
  //
  // For entries filed on hundreds of cases:
  // - Computes array once into a variable (single query, not per-row)
  // - Only updates rows where value actually changes (IS DISTINCT FROM skips no-ops)
  // - docket_entry_id is indexed (part of primary key), so lookups are fast
  await sql`
    create or replace function dw_docket_entry_multi_docketed_insert_trigger()
    returns trigger as $$
    declare
      computed_array varchar[];
    begin
      select case
        when count(*) > 1 then array_agg(docket_number order by docket_number)
        else '{}'::varchar[]
      end
      into computed_array
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      update dw_docket_entry
      set multi_docketed_on = computed_array
      where docket_entry_id = new.docket_entry_id
        and (multi_docketed_on is null or multi_docketed_on is distinct from computed_array);

      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  // Create DELETE trigger to update remaining rows when an entry is removed from a case.
  // Example: Entry on ['101-25', '102-25'] has row for 102-25 deleted.
  //          Remaining row for 101-25 needs updated to [] (no longer multi-docketed).
  //
  // NOTE: DELETE is rare - only happens when deleting initial filing documents.
  await sql`
    create or replace function dw_docket_entry_multi_docketed_delete_trigger()
    returns trigger as $$
    declare
      computed_array varchar[];
      remaining_count int;
    begin
      select count(*) into remaining_count
      from dw_docket_entry
      where docket_entry_id = old.docket_entry_id;

      -- No rows remain with this docketEntryId, nothing to update
      if remaining_count = 0 then
        return old;
      end if;

      select case
        when remaining_count > 1 then array_agg(docket_number order by docket_number)
        else '{}'::varchar[]
      end
      into computed_array
      from dw_docket_entry
      where docket_entry_id = old.docket_entry_id;

      update dw_docket_entry
      set multi_docketed_on = computed_array
      where docket_entry_id = old.docket_entry_id
        and (multi_docketed_on is null or multi_docketed_on is distinct from computed_array);

      return old;
    end;
    $$ language plpgsql
  `.execute(db);

  // Create UPDATE trigger to handle unconsolidation during blue-green deployment.
  // When old code unconsolidates cases, it uses pgInsertInto with ON CONFLICT DO UPDATE,
  // which only updates columns in the old schema. multiDocketedOn won't be touched,
  // leaving stale values. This trigger recomputes the correct array on any update.
  //
  // Performance notes:
  // - Unconsolidation is relatively rare
  // - Trigger skips updates where value is already correct (IS DISTINCT FROM)
  // - docket_entry_id is indexed (part of primary key)
  await sql`
    create or replace function dw_docket_entry_multi_docketed_update_trigger()
    returns trigger as $$
    declare
      computed_array varchar[];
    begin
      select case
        when count(*) > 1 then array_agg(docket_number order by docket_number)
        else '{}'::varchar[]
      end
      into computed_array
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      -- Only update if value actually changed (avoids unnecessary writes)
      if new.multi_docketed_on is distinct from computed_array then
        new.multi_docketed_on := computed_array;
      end if;

      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_multi_docketed_after_insert
    after insert on dw_docket_entry
    for each row execute function dw_docket_entry_multi_docketed_insert_trigger()
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_multi_docketed_after_delete
    after delete on dw_docket_entry
    for each row execute function dw_docket_entry_multi_docketed_delete_trigger()
  `.execute(db);

  // NOTE: UPDATE trigger is created AFTER backfill to avoid recomputing on every
  // backfill update. The trigger is added at the end of the migration.

  // Pre-compute arrays for multi-docketed entries only (entries on 2+ cases).
  // This temp table is much smaller than the full table and makes backfill lookups O(1).
  // Single-case entries aren't included - they just get '{}' via COALESCE during backfill.
  await sql`
    create temp table multi_docketed_lookup as
    select
      docket_entry_id,
      array_agg(docket_number order by docket_number) as multi_docketed_on
    from dw_docket_entry
    group by docket_entry_id
    having count(*) > 1
  `.execute(db);

  await sql`
    create index on multi_docketed_lookup (docket_entry_id)
  `.execute(db);

  // Backfill existing rows in batches.
  // - Small batches (5k) avoid long-running transactions and reduce lock contention
  // - Pauses between batches let replication catch up and reduce WAL pressure
  // - Only INSERT/DELETE triggers exist (no UPDATE trigger needed)
  while (true) {
    const batch = await db
      .selectFrom('dwDocketEntry')
      .select(['docketEntryId', 'docketNumber'])
      .where('multiDocketedOn', 'is', null)
      .limit(BATCH_SIZE)
      .execute();

    if (batch.length === 0) break;

    // Build VALUES list for batch update. Safe because UUIDs and docket numbers
    // don't contain SQL injection characters, but ideally would use parameterized query.
    const pairs = batch
      .map(r => `('${r.docketEntryId}', '${r.docketNumber}')`)
      .join(',');

    // Join with lookup table to get pre-computed array for multi-docketed entries.
    // Entries not in lookup table (single-case) get '{}' via COALESCE.
    const result = await sql`
      update dw_docket_entry as target
      set multi_docketed_on = coalesce(lookup.multi_docketed_on, '{}')
      from (values ${sql.raw(pairs)}) as batch(docket_entry_id, docket_number)
      left join multi_docketed_lookup as lookup
        on lookup.docket_entry_id = batch.docket_entry_id
      where target.docket_entry_id = batch.docket_entry_id
        and target.docket_number = batch.docket_number
      returning target.docket_entry_id
    `.execute(db);

    const updated = result.rows.length;
    total += updated;
    batches += 1;

    if (batches % LOG_EVERY === 0) {
      console.log(
        `multiDocketedOn backfill progress: ${total.toLocaleString()} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(
    `multiDocketedOn backfill complete: ${total.toLocaleString()} rows updated in ${batches} batches`,
  );

  await sql`drop table if exists multi_docketed_lookup`.execute(db);

  // Add NOT NULL constraint in phases to minimize locking:
  // 1. Add as NOT VALID - instant, doesn't scan table
  // 2. Validate - scans table but allows concurrent reads/writes
  // 3. Set NOT NULL - brief exclusive lock to update catalog
  // 4. Drop check constraint - NOT NULL is now enforced directly
  await sql`
    alter table "dw_docket_entry"
    add constraint "dw_docket_entry_multi_docketed_on_nn"
    check ("multi_docketed_on" is not null) not valid
  `.execute(db);

  await sql`
    alter table "dw_docket_entry"
    validate constraint "dw_docket_entry_multi_docketed_on_nn"
  `.execute(db);

  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('multiDocketedOn', col => col.setNotNull())
    .execute();

  await sql`
    alter table "dw_docket_entry"
    drop constraint "dw_docket_entry_multi_docketed_on_nn"
  `.execute(db);

  // Add default so new rows get '{}' automatically.
  // The triggers will correct it if the entry is actually multi-docketed.
  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('multiDocketedOn', col => col.setDefault(sql`'{}'`))
    .execute();

  // Create UPDATE trigger AFTER backfill to avoid recomputing on every backfill update.
  // This trigger handles unconsolidation during blue-green deployment.
  await sql`
    create trigger dw_docket_entry_multi_docketed_before_update
    before update on dw_docket_entry
    for each row execute function dw_docket_entry_multi_docketed_update_trigger()
  `.execute(db);

  // IMPORTANT: Triggers are intentionally left in place!
  // During blue-green deployment, old code pods continue running and don't know
  // about multiDocketedOn. The triggers ensure correct values until new code is
  // fully deployed. Remove triggers in a follow-up migration:
  //
  //   DROP TRIGGER IF EXISTS dw_docket_entry_multi_docketed_after_insert ON dw_docket_entry;
  //   DROP TRIGGER IF EXISTS dw_docket_entry_multi_docketed_after_delete ON dw_docket_entry;
  //   DROP TRIGGER IF EXISTS dw_docket_entry_multi_docketed_before_update ON dw_docket_entry;
  //   DROP FUNCTION IF EXISTS dw_docket_entry_multi_docketed_insert_trigger();
  //   DROP FUNCTION IF EXISTS dw_docket_entry_multi_docketed_delete_trigger();
  //   DROP FUNCTION IF EXISTS dw_docket_entry_multi_docketed_update_trigger();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Clean up temp table if migration failed mid-way
  await sql`drop table if exists multi_docketed_lookup`.execute(db);

  // Remove triggers and functions
  await sql`
    drop trigger if exists dw_docket_entry_multi_docketed_after_insert on dw_docket_entry
  `.execute(db);

  await sql`
    drop trigger if exists dw_docket_entry_multi_docketed_after_delete on dw_docket_entry
  `.execute(db);

  await sql`
    drop trigger if exists dw_docket_entry_multi_docketed_before_update on dw_docket_entry
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_multi_docketed_insert_trigger()
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_multi_docketed_delete_trigger()
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_multi_docketed_update_trigger()
  `.execute(db);

  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('multiDocketedOn')
    .execute();
}
