import { Penalty } from '@shared/business/entities/Penalty';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

export const getCaseStatistics = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawStatistic[]> => {
  const statistics = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatistic as cs')
      .where('docketNumber', '=', docketNumber)
      .leftJoin('dwStatisticPenalty as sp', 'sp.statisticId', 'cs.statisticId')
      .selectAll('cs')
      .select(
        sql`jsonb_agg(to_jsonb(sp) ORDER BY sp.penalty_number)`.as('penalties'),
      )
      .groupBy(['cs.docketNumber', 'cs.statisticId'])
      .execute(),
  );

  return Object.values(
    statistics.map(s => ({
      ...s,
      penalties: (s.penalties as Penalty[]) || [],
      year: s.year?.toString(),
      determinationTotalPenalties: s.determinationTotalPenalties || undefined,
      determinationDeficiencyAmount:
        s.determinationDeficiencyAmount || undefined,
      lastDateOfPeriod: s.lastDateOfPeriod?.toISOString(),
    })),
  );
};
