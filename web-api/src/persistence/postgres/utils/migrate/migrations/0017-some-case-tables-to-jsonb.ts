import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('petitioners', 'jsonb')
    .addColumn('statistics', 'jsonb')
    .addColumn('caseStatusHistory', 'jsonb')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('petitioners')
    .dropColumn('statistics')
    .dropColumn('caseStatusHistory')
    .execute();
}
