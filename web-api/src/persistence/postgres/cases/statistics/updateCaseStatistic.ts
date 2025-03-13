import { Statistic } from '@shared/business/entities/Statistic';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getUpdatedAtWithIndexBasedIncrement } from '@web-api/persistence/postgres/cases/statistics/helper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateCaseStatistic = async ({
  statistic,
}: {
  statistic: Statistic;
}): Promise<Statistic> => {
  const updatedStatistic = await pgUpdateTable({
    table: 'dwCaseStatistic',
    values: {
      determinationDeficiencyAmount:
        statistic.determinationDeficiencyAmount || null,
      determinationTotalPenalties:
        statistic.determinationTotalPenalties || null,
      irsDeficiencyAmount: statistic.irsDeficiencyAmount,
      irsTotalPenalties: statistic.irsTotalPenalties,
      lastDateOfPeriod: statistic.lastDateOfPeriod
        ? calculateDate({ dateString: statistic.lastDateOfPeriod })
        : null,
      year: statistic.year ? parseInt(statistic.year) : null,
      yearOrPeriod: statistic.yearOrPeriod,
      updatedAt: calculateDate({ dateString: formatNow() }),
    },
    where: cb => cb.where('statisticId', '=', statistic.statisticId),
  });

  // Upsert related penalties
  await pgInsertInto({
    table: 'dwStatisticPenalty',
    values: statistic.penalties.map((p, index) => ({
      name: p.name,
      penaltyAmount: p.penaltyAmount,
      penaltyId: p.penaltyId,
      penaltyType: p.penaltyType,
      statisticId: statistic.statisticId,
      updatedAt: getUpdatedAtWithIndexBasedIncrement({ index }),
    })),
    onConflictColumns: ['penaltyId'],
  });

  return new Statistic(updatedStatistic);
};
