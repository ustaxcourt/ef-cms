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
      entry_count int;
      computed_array jsonb;
      computed_original varchar;
    begin
      select count(*),
        case
          when count(*) > 1 then to_jsonb(array_agg(docket_number order by docket_number))
          else '[]'::jsonb
        end,
        case
          when count(*) > 1 then (array_agg(docket_number order by
            case when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
              else 2000 + split_part(docket_number, '-', 2)::int
            end,
            split_part(docket_number, '-', 1)::int
          ))[1]
          else null
        end
      into entry_count, computed_array, computed_original
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      update dw_docket_entry
      set multi_docketed_on = computed_array,
          originally_filed_docket_number = computed_original
      where docket_entry_id = new.docket_entry_id
        and (multi_docketed_on is null
          or multi_docketed_on is distinct from computed_array
          or originally_filed_docket_number is distinct from computed_original);

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
      computed_original varchar;
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
        end,
        case
          when remaining_count > 1 then (array_agg(docket_number order by
            case when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
              else 2000 + split_part(docket_number, '-', 2)::int
            end,
            split_part(docket_number, '-', 1)::int
          ))[1]
          else null
        end
      into computed_array, computed_original
      from dw_docket_entry
      where docket_entry_id = old.docket_entry_id;

      update dw_docket_entry
      set multi_docketed_on = computed_array,
          originally_filed_docket_number = computed_original
      where docket_entry_id = old.docket_entry_id
        and (multi_docketed_on is null
          or multi_docketed_on is distinct from computed_array
          or originally_filed_docket_number is distinct from computed_original);

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
  // - Trigger skips updates where value is already correct (IS DISTINCT FROM)
  // - docket_entry_id is indexed (part of primary key)
  await sql`
    create or replace function dw_docket_entry_multi_docketed_update_trigger()
    returns trigger as $$
    declare
      entry_count int;
      computed_array jsonb;
      computed_original varchar;
    begin
      select count(*),
        case
          when count(*) > 1 then to_jsonb(array_agg(docket_number order by docket_number))
          else '[]'::jsonb
        end,
        case
          when count(*) > 1 then (array_agg(docket_number order by
            case when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
              else 2000 + split_part(docket_number, '-', 2)::int
            end,
            split_part(docket_number, '-', 1)::int
          ))[1]
          else null
        end
      into entry_count, computed_array, computed_original
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      -- Only update if values actually changed (avoids unnecessary writes)
      if new.multi_docketed_on is distinct from computed_array then
        new.multi_docketed_on := computed_array;
      end if;
      if new.originally_filed_docket_number is distinct from computed_original then
        new.originally_filed_docket_number := computed_original;
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
  // Single-case entries aren't included - they just get '[]'::jsonb via COALESCE during backfill.
  // Also captures the lowest docket number for originallyFiledDocketNumber.
  // Docket numbers are formatted as caseNumber-year (e.g., "103-21", "101-22").
  // Years >= 65 are 1900s (1965-1999), years < 65 are 2000s (2000-2064).
  // This matches Case.getSortableDocketNumber logic.
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
          sql<string>`(array_agg(docket_number order by
            case when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
              else 2000 + split_part(docket_number, '-', 2)::int
            end,
            split_part(docket_number, '-', 1)::int
          ))[1]`.as('originallyFiledDocketNumber'),
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
  // Updates both columns in one pass:
  // - multiDocketedOn: COALESCE to '[]' for non-multi-docketed entries
  // - originallyFiledDocketNumber: null for non-multi-docketed
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

    // Join with lookup table to get pre-computed values for multi-docketed entries.
    // Entries not in lookup table (single-case) get '[]'::jsonb and null respectively.
    const result = await db
      .updateTable('dwDocketEntry')
      .set({
        multiDocketedOn: sql`coalesce(
          (select to_jsonb(multi_docketed_on)
            from multi_docketed_lookup
            where docket_entry_id = dw_docket_entry.docket_entry_id),
          '[]'::jsonb
        )`,
        originallyFiledDocketNumber: sql`(
          select originally_filed_docket_number
          from multi_docketed_lookup
          where docket_entry_id = dw_docket_entry.docket_entry_id
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
        `backfill progress: ${total.toLocaleString()} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(
    `backfill complete: ${total.toLocaleString()} rows updated in ${batches} batches`,
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
