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
    .addColumn('multiDocketedOn', 'jsonb')
    .execute();

  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('originallyFiledDocketNumber', 'varchar')
    .execute();

  // Create INSERT trigger to handle new docket entries during migration and blue-green deployment.
  // Old code doesn't know about multiDocketedOn, so when it inserts a row, this trigger
  // computes the correct value by finding all docketNumbers sharing the same docketEntryId.
  //
  // For entries filed on hundreds of cases:
  // - Computes array once into a variable (single query, not per-row)
  // - Only updates rows where value actually changes (IS DISTINCT FROM skips no-ops)
  await sql`
    create or replace function dw_docket_entry_multi_docketed_insert_trigger()
    returns trigger as $$
    declare
      computed_array jsonb;
    begin
      select case
        when count(*) > 1 then to_jsonb(array_agg(docket_number order by docket_number))
        else '[]'::jsonb
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
  await sql`
    create or replace function dw_docket_entry_multi_docketed_delete_trigger()
    returns trigger as $$
    declare
      computed_array jsonb;
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
        when remaining_count > 1 then to_jsonb(array_agg(docket_number order by docket_number))
        else '[]'::jsonb
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
      computed_array jsonb;
    begin
      select case
        when count(*) > 1 then to_jsonb(array_agg(docket_number order by docket_number))
        else '[]'::jsonb
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
  // Single-case entries aren't included - they just get '[]'::jsonb via COALESCE during backfill.
  await db.schema
    .createTable('multiDocketedLookup')
    .temporary()
    .as(
      db
        .selectFrom('dwDocketEntry')
        .select([
          'docketEntryId',
          sql<string[]>`array_agg(docket_number order by docket_number)`.as(
            'multiDocketedOn',
          ),
        ])
        .groupBy('docketEntryId')
        .having(db.fn.count('docketEntryId'), '>', 1),
    )
    .execute();

  await sql`
    create index on multi_docketed_lookup (docket_entry_id)
  `.execute(db);

  // Backfill existing rows in batches using ctid for safe row identification.
  // - Small batches (5k) avoid long-running transactions and reduce lock contention
  // - FOR UPDATE SKIP LOCKED prevents blocking concurrent operations
  // - Pauses between batches let replication catch up and reduce WAL pressure
  while (true) {
    const ctids = await db
      .selectFrom('dwDocketEntry')
      .select(sql`ctid`.as('ctid'))
      .where('multiDocketedOn', 'is', null)
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (ctids.length === 0) break;

    // Join with lookup table to get pre-computed array for multi-docketed entries.
    // Entries not in lookup table (single-case) get '[]'::jsonb via COALESCE.
    const result = await db
      .updateTable('dwDocketEntry')
      .set({
        multiDocketedOn: sql`coalesce(
          (select to_jsonb(multi_docketed_on)
            from multi_docketed_lookup
            where docket_entry_id = dw_docket_entry.docket_entry_id),
          '[]'::jsonb
        )`,
      })
      .where(
        sql`ctid`,
        'in',
        ctids.map(r => r.ctid),
      )
      .returning('docketEntryId')
      .execute();

    const updated = result.length;
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

  // Backfill originallyFiledDocketNumber using the leadDocketNumber from dwCase.
  // For non-consolidated entries, use the entry's own docketNumber.
  total = 0;
  batches = 0;

  while (true) {
    const ctids = await db
      .selectFrom('dwDocketEntry')
      .select(sql`ctid`.as('ctid'))
      .where('originallyFiledDocketNumber', 'is', null)
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (ctids.length === 0) break;

    const result = await db
      .updateTable('dwDocketEntry')
      .set({
        originallyFiledDocketNumber: sql`coalesce(
          (select c.lead_docket_number
            from dw_case c
            where c.docket_number = dw_docket_entry.docket_number),
          dw_docket_entry.docket_number
        )`,
      })
      .where(
        sql`ctid`,
        'in',
        ctids.map(r => r.ctid),
      )
      .returning('docketEntryId')
      .execute();

    const updated = result.length;
    total += updated;
    batches += 1;

    if (batches % LOG_EVERY === 0) {
      console.log(
        `originallyFiledDocketNumber backfill progress: ${total.toLocaleString()} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(
    `originallyFiledDocketNumber backfill complete: ${total.toLocaleString()} rows updated in ${batches} batches`,
  );

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

  await db.schema
    .alterTable('dwDocketEntry')
    .dropConstraint('dwDocketEntry_multiDocketedOn_nn')
    .execute();

  // Add default so new rows get '[]'::jsonb automatically.
  // The triggers will correct it if the entry is actually multi-docketed.
  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('multiDocketedOn', col => col.setDefault(sql`'[]'::jsonb`))
    .execute();

  // Create UPDATE trigger AFTER backfill to avoid recomputing on every backfill update.
  await sql`
    create trigger dw_docket_entry_multi_docketed_before_update
    before update on dw_docket_entry
    for each row execute function dw_docket_entry_multi_docketed_update_trigger()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('multiDocketedLookup').ifExists().execute();

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

  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('originallyFiledDocketNumber')
    .execute();
}
