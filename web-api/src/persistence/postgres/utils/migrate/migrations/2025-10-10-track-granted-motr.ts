import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('remoteTrialGranted', 'boolean')
    .addColumn('remoteTrialGrantedDate', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('remoteTrialGranted')
    .dropColumn('remoteTrialGrantedDate')
    .execute();
}
