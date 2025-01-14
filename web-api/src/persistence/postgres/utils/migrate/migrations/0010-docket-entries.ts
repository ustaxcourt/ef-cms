import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntry')
    .addColumn('createdAt', 'timestamptz')
    .addColumn('docketEntryId', 'varchar')
    .addColumn('docketNumber', 'varchar')
    .addPrimaryKeyConstraint('pkDocketEntry', ['docketEntryId', 'docketNumber'])
    .addColumn('filingDate', 'timestamptz')
    .addColumn('eventCode', 'varchar')
    .addColumn('pending', 'boolean')
    .addColumn('servedAt', 'timestamptz')
    .addColumn('isLegacyServed', 'boolean')
    .addColumn('receivedAt', 'timestamptz')
    .addColumn('documentTitle', 'varchar')
    .addColumn('documentType', 'varchar')
    .addColumn('isStricken', 'boolean')
    .addColumn('judge', 'varchar')
    .addColumn('signedJudgeName', 'varchar')
    .addColumn('isSealed', 'boolean')
    .addColumn('sealedTo', 'varchar')
    .addColumn('numberOfPages', 'integer')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntry').execute();
}
