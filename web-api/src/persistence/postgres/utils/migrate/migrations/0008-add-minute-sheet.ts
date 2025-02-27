import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwMinuteSheet')
    .addColumn('trialSessionId', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('content', 'json')
    .addPrimaryKeyConstraint('pk_minute_sheet', [
      'trialSessionId',
      'docketNumber',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwMinuteSheet').execute();
}
