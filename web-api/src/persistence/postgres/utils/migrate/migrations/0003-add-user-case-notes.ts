import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwUserCaseNote')
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('notes', 'text')
    .addPrimaryKeyConstraint('pk_user_case_note', ['docketNumber', 'userId'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwUserCaseNote').execute();
}
