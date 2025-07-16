import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dw_work_item')
    .alterColumn('associatedJudge', (col) => col.dropNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db
  .updateTable('dw_work_item')
  .set({ associatedJudge: CHIEF_JUDGE })
  .where('associatedJudge', 'is', null)
  .execute();

await db.schema
  .alterTable('dw_work_item')
  .alterColumn('associatedJudge', (col) => col.setNotNull())
  .execute();
}
