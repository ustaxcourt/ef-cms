import { Database } from '@web-api/persistence/postgres/database-schema';
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`
    insert into dw_feature_flag (name, value)
    values ('reporting-calendars', '{"current":false}')
    on conflict(name) do nothing
  `.execute(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
  await sql`
    delete from dw_feature_flag
    where name = 'reporting-calendars'
  `.execute(db);
}
