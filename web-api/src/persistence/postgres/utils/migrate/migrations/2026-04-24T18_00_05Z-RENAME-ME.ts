import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom('dwMessage')
    .where('messageId', '=', 'TEST-MESSAGE-ID')
    .execute();
}

export async function down(_db: Kysely<any>): Promise<void> {
  // TODO
}
