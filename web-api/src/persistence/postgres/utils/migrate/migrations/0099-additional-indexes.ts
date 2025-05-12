import { Kysely } from 'kysely';

const featureFlagsTableName = 'dwFeatureFlag';
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(featureFlagsTableName)
    .addColumn('name', 'varchar', col => col.primaryKey())
    .addColumn('value', 'jsonb', col => col.notNull())
    .execute();
}


export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(featureFlagsTableName).execute();
}