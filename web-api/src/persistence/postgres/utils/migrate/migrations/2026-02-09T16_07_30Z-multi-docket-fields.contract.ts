import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('multiDocketedLookup').ifExists().execute();

  await db.schema.dropTable('consolidatedCaseGroups').ifExists().execute();

  await sql`
    drop trigger if exists dw_docket_entry_multi_docketed_after_insert on dw_docket_entry
  `.execute(db);

  await sql`
    drop trigger if exists dw_docket_entry_multi_docketed_before_update on dw_docket_entry
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_multi_docketed_insert_trigger()
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_multi_docketed_update_trigger()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // FIX THIS
  // await db.schema
  //   .createTable('multiDocketedLookup')
  //   .temporary()
  //   .as(
  //     db
  //       .selectFrom('dwDocketEntry')
  //       .select([
  //         'docketEntryId',
  //         sql<string[]>`array_agg(docket_number order by docket_number)`.as(
  //           'multiDocketedOn',
  //         ),
  //         sql<string>`(array_agg(docket_number order by
  //           case when split_part(docket_number, '-', 2)::int >= 65
  //             then 1900 + split_part(docket_number, '-', 2)::int
  //             else 2000 + split_part(docket_number, '-', 2)::int
  //           end,
  //           split_part(docket_number, '-', 1)::int
  //         ))[1]`.as('originallyFiledDocketNumber'),
  //       ])
  //       .groupBy('docketEntryId')
  //       .having(db.fn.count('docketEntryId'), '>', 1),
  //   )
  //   .execute();
  // await sql`
  //   create or replace function dw_docket_entry_multi_docketed_insert_trigger()
  //   returns trigger as $$
  //   declare
  //     entry_count int;
  //     computed_array jsonb;
  //     computed_original varchar;
  //   begin
  //     select count(*),
  //       case
  //         when count(*) > 1 then to_jsonb(array_agg(docket_number order by docket_number))
  //         else '[]'::jsonb
  //       end,
  //       case
  //         when count(*) > 1 then (array_agg(docket_number order by
  //           case when split_part(docket_number, '-', 2)::int >= 65
  //             then 1900 + split_part(docket_number, '-', 2)::int
  //             else 2000 + split_part(docket_number, '-', 2)::int
  //           end,
  //           split_part(docket_number, '-', 1)::int
  //         ))[1]
  //         else null
  //       end
  //     into entry_count, computed_array, computed_original
  //     from dw_docket_entry
  //     where docket_entry_id = new.docket_entry_id;
  //     update dw_docket_entry
  //     set multi_docketed_on = computed_array,
  //         originally_filed_docket_number = computed_original
  //     where docket_entry_id = new.docket_entry_id
  //       and (multi_docketed_on is null
  //         or multi_docketed_on is distinct from computed_array
  //         or originally_filed_docket_number is distinct from computed_original);
  //     return new;
  //   end;
  //   $$ language plpgsql
  // `.execute(db);
  // await sql`
  //   create or replace function dw_docket_entry_multi_docketed_update_trigger()
  //   returns trigger as $$
  //   declare
  //     entry_count int;
  //     computed_array jsonb;
  //     computed_original varchar;
  //   begin
  //     select count(*),
  //       case
  //         when count(*) > 1 then to_jsonb(array_agg(docket_number order by docket_number))
  //         else '[]'::jsonb
  //       end,
  //       case
  //         when count(*) > 1 then (array_agg(docket_number order by
  //           case when split_part(docket_number, '-', 2)::int >= 65
  //             then 1900 + split_part(docket_number, '-', 2)::int
  //             else 2000 + split_part(docket_number, '-', 2)::int
  //           end,
  //           split_part(docket_number, '-', 1)::int
  //         ))[1]
  //         else null
  //       end
  //     into entry_count, computed_array, computed_original
  //     from dw_docket_entry
  //     where docket_entry_id = new.docket_entry_id;
  //     -- Only update if values actually changed (avoids unnecessary writes)
  //     if new.multi_docketed_on is distinct from computed_array then
  //       new.multi_docketed_on := computed_array;
  //     end if;
  //     if new.originally_filed_docket_number is distinct from computed_original then
  //       new.originally_filed_docket_number := computed_original;
  //     end if;
  //     return new;
  //   end;
  //   $$ language plpgsql
  // `.execute(db);
  // await sql`
  //   create trigger dw_docket_entry_multi_docketed_after_insert
  //   after insert on dw_docket_entry
  //   for each row execute function dw_docket_entry_multi_docketed_insert_trigger()
  // `.execute(db);
  // await sql`
  //   create trigger dw_docket_entry_multi_docketed_before_update
  //   before update on dw_docket_entry
  //   for each row execute function dw_docket_entry_multi_docketed_update_trigger()
  // `.execute(db);
}
