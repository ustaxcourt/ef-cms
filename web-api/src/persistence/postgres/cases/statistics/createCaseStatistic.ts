import { Statistic } from '@shared/business/entities/Statistic';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getUpdatedAtWithIndexBasedIncrement } from '@web-api/persistence/postgres/cases/statistics/helper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createCaseStatistic = async ({
  docketNumber,
  statistic,
}: {
  docketNumber: string;
  statistic: Statistic;
}): Promise<void> => {
  await pgInsertInto({
    table: 'dwCaseStatistic',
    values: [
      {
        determinationDeficiencyAmount: statistic.determinationDeficiencyAmount,
        determinationTotalPenalties: statistic.determinationTotalPenalties,
        docketNumber,
        irsDeficiencyAmount: statistic.irsDeficiencyAmount,
        irsTotalPenalties: statistic.irsTotalPenalties,
        lastDateOfPeriod: statistic.lastDateOfPeriod
          ? calculateDate({ dateString: statistic.lastDateOfPeriod })
          : null,
        statisticId: statistic.statisticId,
        year: statistic.year ? parseInt(statistic.year) : null,
        yearOrPeriod: statistic.yearOrPeriod ?? null,
        updatedAt: calculateDate({ dateString: formatNow() }),
      },
    ],
  });

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
};
