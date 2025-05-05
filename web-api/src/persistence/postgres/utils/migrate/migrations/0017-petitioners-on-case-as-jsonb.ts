import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('petitioners', 'jsonb')
    .addColumn('statistics', 'jsonb')
    .execute();
  // 10502 TODO: translate data to jsonb if dwPetitionerOnCase has data
  await db.schema.dropTable('dwPetitionerOnCase');
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('petitioners')
    .dropColumn('statistics')
    .execute();
  // TODO 10502?
  console.error(
    'Dropped columns petitioners and statistics from dwCase, but this could be a breaking change (no more petitioner data)',
  );
}
