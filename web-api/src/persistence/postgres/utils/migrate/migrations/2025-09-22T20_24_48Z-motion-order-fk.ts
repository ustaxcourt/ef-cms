import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntryRelatedDocketEntry')
    .addColumn('primaryDocketEntryId', 'uuid') // order
    .addColumn('primaryDocketNumber', 'varchar')
    .addColumn('secondaryDocketEntryId', 'uuid') // motion
    .addColumn('secondaryDocketNumber', 'varchar')
    .addColumn('disposition', 'varchar')
    .addColumn('served', 'boolean')
    .addPrimaryKeyConstraint('dwDocketEntryRelatedDocketEntryPK', [
      'primaryDocketEntryId',
      'primaryDocketNumber',
      'secondaryDocketEntryId',
      'secondaryDocketNumber',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntryRelatedDocketEntry');
}
