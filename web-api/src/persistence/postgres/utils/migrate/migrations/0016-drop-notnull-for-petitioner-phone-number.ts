import { Kysely } from 'kysely';

// We always sort by receivedAt and docketNumber, so we add compound indices based on these and on the Custom Case filter types.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwPetitionerOnCase')
    .alterColumn('phone', col => col.dropNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwPetitionerOnCase')
    .alterColumn('phone', col => col.setDefault(''))
    .alterColumn('phone', col => col.setNotNull())
    .execute();
}
