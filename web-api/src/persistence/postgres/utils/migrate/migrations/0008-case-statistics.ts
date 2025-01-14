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
    .addColumn('determinationTotalPenalties', 'decimal')
    .addColumn('determinationDeficiencyAmount', 'decimal')
    .addColumn('lastDateOfPeriod', 'timestamptz')
    .execute();

  await db.schema
    .createTable('dwStatisticPenalty')
    .addColumn('statisticId', 'varchar')
    .addColumn('name', 'varchar')
    .addColumn('penaltyAmount', 'decimal')
    .addColumn('penaltyId', 'varchar', col => col.primaryKey())
    .addColumn('penaltyType', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwStatisticPenalty').execute();
  await db.schema.dropTable('dwCaseStatistic').execute();
}
