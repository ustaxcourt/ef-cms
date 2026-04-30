import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwChangeOfAddressNew').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwChangeOfAddress')
    .renameTo('dwChangeOfAddressNew')
    .execute();

  await db.schema
    .alterTable('dwChangeOfAddressNew')
    .renameConstraint('dwChangeOfAddressPkey', 'dwChangeOfAddressNewPkey')
    .execute();

  await db.schema
    .createTable('dwChangeOfAddress')
    .addColumn('jobId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addPrimaryKeyConstraint('dwChangeOfAddressPkey', [
      'jobId',
      'docketNumber',
    ])
    .execute();
}
