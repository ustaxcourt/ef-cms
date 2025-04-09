import { Kysely } from 'kysely';

const connectionTableName = 'dwConnection';
const connectionUserIdIndex = 'idx_connection_userId';
const connectionExpirationIndex = 'idx_connection_expirationDate';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(connectionTableName)
    .addColumn('connectionId', 'varchar', col => col.primaryKey())
    .addColumn('clientConnectionId', 'varchar', col => col.notNull())
    .addColumn('endpoint', 'varchar', col => col.notNull())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('expirationDate', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex(connectionUserIdIndex)
    .on(connectionTableName)
    .column('userId')
    .execute();

  await db.schema
    .createIndex(connectionExpirationIndex)
    .on(connectionTableName)
    .column('expirationDate')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(connectionExpirationIndex).execute();
  await db.schema.dropIndex(connectionUserIdIndex).execute();
  await db.schema.dropTable(connectionTableName).execute();
}
