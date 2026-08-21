import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwChangeOfAddressNew')
    .addColumn('jobId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addPrimaryKeyConstraint('dwChangeOfAddressNewPkey', ['jobId', 'docketNumber'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwChangeOfAddressNew').execute();
}
