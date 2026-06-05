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
    begin
      if new.originally_filed_docket_number is null then
        update dw_docket_entry
        set originally_filed_docket_number = new.docket_number
        where docket_number = new.docket_number
          and docket_entry_id = new.docket_entry_id
          and originally_filed_docket_number is null;
      end if;
      return null;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_originally_filed_after_insert
    after insert on dw_docket_entry
    for each row execute function dw_docket_entry_originally_filed_insert_trigger()
  `.execute(db);

  await sql`
    create or replace function dw_docket_entry_originally_filed_update_trigger()
    returns trigger as $$
    begin
      if new.originally_filed_docket_number is null then
        new.originally_filed_docket_number := new.docket_number;
      end if;
      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_originally_filed_before_update
    before update on dw_docket_entry
    for each row execute function dw_docket_entry_originally_filed_update_trigger()
  `.execute(db);
}
