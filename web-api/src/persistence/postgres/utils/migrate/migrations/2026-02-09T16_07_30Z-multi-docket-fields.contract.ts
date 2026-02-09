import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
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
}

export async function down(db: Kysely<any>): Promise<void> {
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

  await sql`
    create trigger dw_docket_entry_multi_docketed_before_update
    before update on dw_docket_entry
    for each row execute function dw_docket_entry_multi_docketed_update_trigger()
  `.execute(db);
}
