import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwCaseStatistic')
    .addColumn('docketNumber', 'varchar')
    .addColumn('irsDeficiencyAmount', 'decimal')
    .addColumn('irsTotalPenalties', 'decimal')
    .addColumn('statisticId', 'varchar', col => col.primaryKey())
    .addColumn('year', 'smallint')
    .addColumn('yearOrPeriod', 'varchar')
    .addForeignKeyConstraint(
      'case_statistic_to_case_fk',
      ['docketNumber'],
      'dwCase',
      ['docketNumber'],
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwCaseStatistic').execute();
}
