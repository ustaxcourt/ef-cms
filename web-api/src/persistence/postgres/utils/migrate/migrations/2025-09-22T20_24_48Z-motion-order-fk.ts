import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntryRelatedDocketEntry')
    .addColumn('docketNumber', 'varchar')
    .addColumn('primaryDocketEntryId', 'varchar') // order
    .addColumn('secondaryDocketEntryId', 'varchar') // motion
    .addColumn('disposition', 'varchar')
    .addColumn('served', 'boolean')
    .addPrimaryKeyConstraint('dwDocketEntryRelatedDocketEntryPK', [
      'docketNumber',
      'primaryDocketEntryId',
      'secondaryDocketEntryId',
    ])
    .addForeignKeyConstraint(
      'dwDocketEntryRelatedDocketEntryPrimaryFK',
      ['docketNumber', 'primaryDocketEntryId'],
      'dwDocketEntry',
      ['docketNumber', 'docketEntryId'],
    )
    .addForeignKeyConstraint(
      'dwDocketEntryRelatedDocketEntrySecondaryFK',
      ['docketNumber', 'secondaryDocketEntryId'],
      'dwDocketEntry',
      ['docketNumber', 'docketEntryId'],
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntryRelatedDocketEntry');
}
