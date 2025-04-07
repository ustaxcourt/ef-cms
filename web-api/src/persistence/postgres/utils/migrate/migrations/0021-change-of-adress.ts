import { Kysely } from 'kysely';

const tableName = 'dwChangeOfAddress';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('jobId', 'varchar', col => col.primaryKey())
    .addColumn('remaining', 'integer', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
