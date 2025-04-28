import { Penalty } from '@shared/business/entities/Penalty';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export const getCaseStatistics = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawStatistic[]> => {
  // We want statistics ordered first by date, then by most recently updated first
  // We want penalties ordered by most recently updated last
  const statistics = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatistic as cs')
      .where('docketNumber', '=', docketNumber)
      .leftJoin('dwStatisticPenalty as sp', 'sp.statisticId', 'cs.statisticId')
      .selectAll('cs')
      .select(
        sql`jsonb_agg(to_jsonb(sp) ORDER BY sp.updated_at)`.as('penalties'),
      )
      .orderBy('cs.year')
      .orderBy('cs.updatedAt', 'desc')
      .groupBy(['cs.docketNumber', 'cs.statisticId'])
      .execute(),
  );

  return Object.values(
    statistics.map(s => ({
      ...s,
      penalties: (s.penalties as Penalty[]) ?? [],
      year: s.year?.toString(),
      yearOrPeriod: s.yearOrPeriod ?? undefined,
      determinationTotalPenalties: s.determinationTotalPenalties ?? undefined,
      determinationDeficiencyAmount:
        s.determinationDeficiencyAmount ?? undefined,
      lastDateOfPeriod: s.lastDateOfPeriod?.toISOString(),
    })),
  );
};
