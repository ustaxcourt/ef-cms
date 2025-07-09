import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('qcAt')
    .dropColumn('qcByUserId')
    .dropColumn('signedJudgeUserId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('qcAt', 'timestamptz')
    .addColumn('qcByUserId', 'varchar')
    .addColumn('signedJudgeUserId', 'varchar')
    .execute();
}
