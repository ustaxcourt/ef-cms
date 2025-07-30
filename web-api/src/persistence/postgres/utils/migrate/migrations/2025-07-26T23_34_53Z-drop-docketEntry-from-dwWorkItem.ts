import { Database } from '@web-api/persistence/postgres/database-schema';
import { CompiledQuery, Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwWorkItem').dropColumn('docketEntry').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwWorkItem')
    .addColumn('docketEntry', 'jsonb', col =>
      col.notNull().defaultTo(JSON.stringify({})),
    )
    .execute();
  await attachDocketEntryDataToWorkItems(db);
}

async function attachDocketEntryDataToWorkItems(db: Kysely<Database>) {
  // Easier to do this in raw SQL rather than fiddling with kysely, and we don't really need the types anyway
  return db.executeQuery(
    CompiledQuery.raw(`
      UPDATE dw_work_item AS w
      SET    docket_entry = row_to_json(d)
      FROM   dw_docket_entry AS d
      WHERE  w.docket_entry_id = d.docket_entry_id
        AND  w.docket_number    = d.docket_number;`),
  );
}
