import { Statistic } from '@shared/business/entities/Statistic';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getUpdatedAtWithIndexBasedIncrement } from '@web-api/persistence/postgres/cases/statistics/helper';
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
    values: statistics.map((s, index) => ({
      docketNumber,
      statisticId: s.statisticId,
      determinationDeficiencyAmount: s.determinationDeficiencyAmount ?? null,
      determinationTotalPenalties: s.determinationTotalPenalties ?? null,
      irsDeficiencyAmount: s.irsDeficiencyAmount,
      irsTotalPenalties: s.irsTotalPenalties,
      lastDateOfPeriod: s.lastDateOfPeriod
        ? calculateDate({ dateString: s.lastDateOfPeriod })
        : null,
      year: s.year ? parseInt(s.year) : null,
      yearOrPeriod: s.yearOrPeriod,
      // We want to maintain the order of statistics
      // We add a slight offset in case of duplicate timestamps
      updatedAt: getUpdatedAtWithIndexBasedIncrement({ index }),
    })),
    onConflictColumns: ['statisticId'],
  });

  // Upsert related penalties
  const penalties = flatten(
    statistics.map(s =>
      // We had cases in which the statisticId of the penalty did not match its parent statistic, so we use statistic.statisticId
      s.penalties.map(p => ({
        ...p,
        statisticId: s.statisticId,
      })),
    ),
  );
  if (isEmpty(penalties)) {
    return;
  }

  await pgInsertInto({
    table: 'dwStatisticPenalty',
    values: penalties.map((p, index) => ({
      name: p.name,
      penaltyAmount: p.penaltyAmount,
      penaltyId: p.penaltyId,
      penaltyType: p.penaltyType,
      statisticId: p.statisticId,
      updatedAt: getUpdatedAtWithIndexBasedIncrement({ index }),
    })),
    onConflictColumns: ['penaltyId'],
  });
};
