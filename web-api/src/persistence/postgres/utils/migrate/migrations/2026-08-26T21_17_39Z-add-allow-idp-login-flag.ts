import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
      insert into dw_feature_flag (name, value) 
      values ('allow-idp-login', '{"current":false}')
      on conflict(name) do update set value = excluded.value
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      delete from dw_feature_flag
      where name = 'allow-idp-login'
    `.execute(db);
}
