import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    drop trigger if exists dw_docket_entry_originally_filed_after_insert on dw_docket_entry
  `.execute(db);

  await sql`
    drop trigger if exists dw_docket_entry_originally_filed_before_update on dw_docket_entry
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_originally_filed_insert_trigger()
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_originally_filed_update_trigger()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    create or replace function dw_docket_entry_originally_filed_insert_trigger()
    returns trigger as $$
    declare
      computed_original varchar;
    begin
      select (
        array_agg(docket_number order by
          case
            when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
            else 2000 + split_part(docket_number, '-', 2)::int
          end,
          split_part(docket_number, '-', 1)::int
        )
      )[1]
      into computed_original
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      update dw_docket_entry
      set originally_filed_docket_number = computed_original
      where docket_entry_id = new.docket_entry_id
        and originally_filed_docket_number is distinct from computed_original;

      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create or replace function dw_docket_entry_originally_filed_update_trigger()
    returns trigger as $$
    declare
      computed_original varchar;
    begin
      select (
        array_agg(docket_number order by
          case
            when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
            else 2000 + split_part(docket_number, '-', 2)::int
          end,
          split_part(docket_number, '-', 1)::int
        )
      )[1]
      into computed_original
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      if new.originally_filed_docket_number is distinct from computed_original then
        new.originally_filed_docket_number := computed_original;
      end if;

      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_originally_filed_after_insert
    after insert on dw_docket_entry
    for each row execute function dw_docket_entry_originally_filed_insert_trigger()
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_originally_filed_before_update
    before update on dw_docket_entry
    for each row execute function dw_docket_entry_originally_filed_update_trigger()
  `.execute(db);
}
