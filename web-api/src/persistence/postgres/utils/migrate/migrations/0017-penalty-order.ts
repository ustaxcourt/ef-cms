import { formatNow } from '@shared/business/utilities/DateHandler';
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwStatisticPenalty')
    .addColumn('updatedAt', 'timestamp', col =>
      col.notNull().defaultTo(formatNow()),
    )
    .execute();
  await db.schema
    .alterTable('dwCaseStatistic')
    .addColumn('updatedAt', 'timestamp', col =>
      col.notNull().defaultTo(formatNow()),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwStatisticPenalty')
    .dropColumn('updatedAt')
    .execute();
  await db.schema
    .alterTable('dwCaseStatistic')
    .dropColumn('updatedAt')
    .execute();
}
