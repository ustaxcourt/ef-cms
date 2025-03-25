import { Statistic } from '@shared/business/entities/Statistic';
import { calculateDate } from '@shared/business/utilities/DateHandler';
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
        yearOrPeriod: statistic.yearOrPeriod,
      },
    ],
  });
};
