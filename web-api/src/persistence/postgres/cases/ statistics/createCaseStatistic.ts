import { Statistic } from '@shared/business/entities/Statistic';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const createCaseStatistic = async ({
  docketNumber,
  statistic,
}: {
  docketNumber: string;
  statistic: Statistic;
}): Promise<void> => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseStatistic')
      .values({
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
      })
      .execute(),
  );
};
