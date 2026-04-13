import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwChangeOfAddress')
    .renameTo('dwChangeOfAddressOld')
    .execute();

  await db.schema
    .alterTable('dwChangeOfAddressOld')
    .renameConstraint('dwChangeOfAddressPkey', 'dwChangeOfAddressOldPkey')
    .execute();

  await db.schema
    .createTable('dwChangeOfAddress')
    .addColumn('jobId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addPrimaryKeyConstraint('dwChangeOfAddressPkey', ['jobId', 'docketNumber'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwChangeOfAddress').execute();

  await db.schema
    .alterTable('dwChangeOfAddressOld')
    .renameTo('dwChangeOfAddress')
    .execute();

  await db.schema
    .alterTable('dwChangeOfAddress')
    .renameConstraint('dwChangeOfAddressOldPkey', 'dwChangeOfAddressPkey')
    .execute();
}
