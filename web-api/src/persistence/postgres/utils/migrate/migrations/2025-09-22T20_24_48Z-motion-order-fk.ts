import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntryRelatedDocketEntry')
    .addColumn('docketNumber', 'varchar')
    .addColumn('primaryDocketEntryId', 'uuid') // order
    .addColumn('secondaryDocketEntryId', 'uuid') // motion
    .addColumn('disposition', 'varchar')
    .addColumn('served', 'boolean')
    .addPrimaryKeyConstraint('dwDocketEntryRelatedDocketEntryPK', [
      'docketNumber',
      'primaryDocketEntryId',
      'secondaryDocketEntryId',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntryRelatedDocketEntry');
}
