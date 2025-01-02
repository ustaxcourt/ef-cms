import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwPractitionerOnCase')
    .addColumn('docketNumber', 'varchar')
    .addColumn('userId', 'varchar')
    .addPrimaryKeyConstraint('pk_practitioner_on_case', [
      'docketNumber',
      'userId',
    ])
    .addColumn('email', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwPractitionerOnCase').execute();
}
