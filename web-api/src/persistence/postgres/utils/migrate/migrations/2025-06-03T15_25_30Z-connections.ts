import { Kysely } from 'kysely';

const connectionTableName = 'dwConnection';
const connectionUserIdIndex = 'idx_connection_userId';
const connectionTTLIndex = 'idx_connection_ttl';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(connectionTableName)
    .addColumn('connectionId', 'varchar', col => col.primaryKey())
    .addColumn('clientConnectionId', 'varchar', col => col.notNull())
    .addColumn('endpoint', 'varchar', col => col.notNull())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex(connectionUserIdIndex)
    .on(connectionTableName)
    .column('userId')
    .execute();

  await db.schema
    .createIndex(connectionTTLIndex)
    .on(connectionTableName)
    .column('ttl')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(connectionTTLIndex).execute();
  await db.schema.dropIndex(connectionUserIdIndex).execute();
  await db.schema.dropTable(connectionTableName).execute();
}
