import { Kysely } from 'kysely';

const notificationTableName = 'dwNotification';
const notificationTTLIndex = 'idx_notification_ttl';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(notificationTableName)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('topic', 'varchar', col => col.notNull())
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex(notificationTTLIndex)
    .on(notificationTableName)
    .column('ttl')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(notificationTTLIndex).execute();
  await db.schema.dropTable(notificationTableName).execute();
}
