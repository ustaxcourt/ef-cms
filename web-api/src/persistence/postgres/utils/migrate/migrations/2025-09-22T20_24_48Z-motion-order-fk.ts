import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntryOrderMotion')
    .addColumn('orderDocketEntryId', 'uuid')
    .addColumn('orderDocketNumber', 'varchar') // Is this needed?
    .addColumn('motionDocketEntryId', 'uuid')
    .addColumn('motionDocketNumber', 'varchar')
    .addColumn('disposition', 'varchar')
    .addColumn('served', 'boolean')
    .addPrimaryKeyConstraint('dwDocketEntryOrderMotionPK', [
      'orderDocketEntryId',
      'motionDocketEntryId',
      'motionDocketNumber',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntryOrderMotion');
}
