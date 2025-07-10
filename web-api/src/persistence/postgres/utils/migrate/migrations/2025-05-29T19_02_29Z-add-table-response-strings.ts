import { Kysely } from 'kysely';

const responseStringTableUserRequestIndex = 'idx_response_string_user_request';
const responseStringTableTTLIndex = 'idx_response_string_ttl';

const responseTableName = 'dwResponseString';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(responseTableName)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('requestId', 'varchar', col => col.notNull())
    .addColumn('responseString', 'text', col => col.notNull())
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex(responseStringTableUserRequestIndex)
    .on(responseTableName)
    .columns(['userId', 'requestId'])
    .unique()
    .execute();

  await db.schema
    .createIndex(responseStringTableTTLIndex)
    .on(responseTableName)
    .column('ttl')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(responseStringTableUserRequestIndex).execute();
  await db.schema.dropIndex(responseStringTableTTLIndex).execute();

  await db.schema.dropTable('dwResponseString').execute();
}
