import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn(
      'documentStorageId',
      'varchar',
      // col =>
      //   col
      //     .notNull()
      //     .defaultTo(eb => ({ documentStorageId: eb.ref('docketEntryId') })),
      // .defaultTo(db.fn.ref('docketEntry')),
    )
    .execute();

  await db
    .updateTable('dwDocketEntry')
    .set(eb => ({ documentStorageId: eb.ref('docketEntryId') }))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // TODO
  await db;
}
