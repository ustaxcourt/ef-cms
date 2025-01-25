import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idx_caseCorrespondence_docketNumber')
    .on('dwCaseCorrespondence')
    .column('docketNumber')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_caseCorrespondence_docketNumber')
    .on('dwCaseCorrespondence')
    .execute();
}
