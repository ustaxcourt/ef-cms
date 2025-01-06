import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntry')
    .addColumn('docketEntryId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addPrimaryKeyConstraint('pk_docket_entry', [
      'docketEntryId',
      'docketNumber',
    ])
    .addColumn('filingDate', 'timestamptz')
    .addColumn('eventCode', 'varchar')
    .addColumn('pending', 'boolean')
    .addColumn('servedAt', 'timestamptz')
    .addColumn('isLegacyServed', 'boolean')
    .addColumn('receivedAt', 'timestamptz')
    .addColumn('documentTitle', 'varchar')
    .addColumn('documentType', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntry').execute();
}
