import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // BELOW SUBJECT TO CHANGE
  await sql`
      insert into dw_feature_flag (name, value)
      values ('motion-visibility-policy-change-date', '{"current": "2027-01-01"}')
      on conflict(name) do update set value = excluded.value
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      delete from dw_feature_flag
      where name = 'motion-visibility-policy-change-date'
    `.execute(db);
}
