import { Statistic } from '@shared/business/entities/Statistic';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { flatten, isEmpty } from 'lodash';

// Prefer createCaseStatistic, deleteCaseStatistic, or updateCaseStatistic.
// This is here for backwards compatibility with our Dynamo persistence patterns. In an ideal world, it wouldn't exist.
export const upsertCaseStatistics = async ({
  docketNumber,
  statistics,
}: {
  docketNumber: string;
  statistics: Statistic[];
}) => {
  await pgInsertInto({
    table: 'dwCaseStatistic',
    values: statistics.map(s => ({
      docketNumber,
      statisticId: s.statisticId,
      determinationDeficiencyAmount: s.determinationDeficiencyAmount || null,
      determinationTotalPenalties: s.determinationTotalPenalties || null,
      irsDeficiencyAmount: s.irsDeficiencyAmount,
      irsTotalPenalties: s.irsTotalPenalties,
      lastDateOfPeriod: s.lastDateOfPeriod
        ? calculateDate({ dateString: s.lastDateOfPeriod })
        : null,
      year: s.year ? parseInt(s.year) : null,
      yearOrPeriod: s.yearOrPeriod,
    })),
    onConflictColumns: ['statisticId'],
  });

  // Upsert related penalties
  const penalties = flatten(statistics.map(s => s.penalties));
  if (isEmpty(penalties)) {
    return;
  }

  await pgInsertInto({
    table: 'dwStatisticPenalty',
    values: penalties.map(p => ({
      name: p.name,
      penaltyAmount: p.penaltyAmount,
      penaltyId: p.penaltyId,
      penaltyType: p.penaltyType,
      statisticId: p.statisticId,
    })),
    onConflictColumns: ['penaltyId'],
  });
};
