import { Kysely } from 'kysely';

const notificationTableName = 'dwNotification';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(notificationTableName)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('topic', 'varchar', col => col.notNull())
    .addColumn('expirationDate', 'bigint', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(notificationTableName).execute();
}
