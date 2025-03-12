import { RawStatistic } from '@shared/business/entities/Statistic';
import { getDbReader } from '@web-api/database';

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
      .selectAll()
      .select('cs.statisticId')
      .execute(),
  );

  // Group penalties by statisticId
  const statisticsWithPenalties: Record<string, RawStatistic> =
    statistics.reduce(
      (acc, row) => {
        const {
          determinationDeficiencyAmount,
          determinationTotalPenalties,
          irsDeficiencyAmount,
          irsTotalPenalties,
          lastDateOfPeriod,
          statisticId,
          year,
          yearOrPeriod,
          ...penaltyData
        } = row;
        if (!acc[statisticId]) {
          acc[statisticId] = {
            determinationDeficiencyAmount:
              determinationDeficiencyAmount || undefined,
            determinationTotalPenalties:
              determinationTotalPenalties || undefined,
            irsDeficiencyAmount,
            irsTotalPenalties,
            lastDateOfPeriod: lastDateOfPeriod?.toISOString(),
            penalties: [],
            statisticId,
            year: year?.toString(),
            yearOrPeriod,
          };
        }
        if (penaltyData.penaltyId) {
          acc[statisticId].penalties.push(penaltyData);
        }
        return acc;
      },
      {} as Record<string, RawStatistic>,
    );

  return Object.values(statisticsWithPenalties);
};
