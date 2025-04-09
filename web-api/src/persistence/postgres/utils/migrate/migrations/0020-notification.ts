import { Kysely } from 'kysely';

const notificationTableName = 'dwNotification';
const notificationExpirationIndex = 'idx_notification_expirationDate';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(notificationTableName)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('topic', 'varchar', col => col.notNull())
    .addColumn('expirationDate', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex(notificationExpirationIndex)
    .on(notificationTableName)
    .column('expirationDate')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(notificationExpirationIndex).execute();
  await db.schema.dropTable(notificationTableName).execute();
}
