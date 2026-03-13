import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwChangeOfAddress')
    .dropColumn('remaining')
    .addColumn('docketNumber', 'varchar')
    .execute();

  await sql`
  ALTER TABLE dw_change_of_address DROP CONSTRAINT dw_change_of_address_pkey
  `.execute(db);

  await sql`
  ALTER TABLE dw_change_of_address ADD PRIMARY KEY (job_id, docket_number)
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwChangeOfAddress')
    .dropColumn('docketNumber')
    .addColumn('remaining', 'integer', col => col.notNull())
    .execute();

  await sql`
  ALTER TABLE dw_change_of_address DROP CONSTRAINT dw_change_of_address_pkey
  `.execute(db);

  await sql`
  ALTER TABLE dw_change_of_address ADD PRIMARY KEY (job_id)
  `.execute(db);
}
