import { Statistic } from '@shared/business/entities/Statistic';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getUpdatedAtWithIndexBasedIncrement } from '@web-api/persistence/postgres/cases/statistics/helper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { flatten, isEmpty } from 'lodash';

export const createCaseStatistics = async ({
  docketNumber,
  statistics,
}: {
  docketNumber: string;
  statistics: Statistic[];
}): Promise<void> => {
  const statisticsKysely = statistics.map(statistic => ({
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
  }));

  const relatedPenalties = flatten(statistics.map(s => s.penalties));
  if (isEmpty(relatedPenalties)) {
    return;
  }

  const relatedPenaltiesKysely = relatedPenalties.map((p, index) => ({
    name: p.name,
    penaltyAmount: p.penaltyAmount,
    penaltyId: p.penaltyId,
    penaltyType: p.penaltyType,
    statisticId: p.statisticId,
    updatedAt: getUpdatedAtWithIndexBasedIncrement({ index }),
  }));

  await settlePromises([
    pgInsertInto({
      table: 'dwCaseStatistic',
      values: statisticsKysely,
    }),
    pgInsertInto({
      table: 'dwStatisticPenalty',
      values: relatedPenaltiesKysely,
    }),
  ]);
};
