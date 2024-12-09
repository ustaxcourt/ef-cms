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
        determinationDeficiencyAmount: parseFloat(
          statistic.determinationDeficiencyAmount,
        ),
        determinationTotalPenalties: parseFloat(
          statistic.determinationTotalPenalties,
        ),
        docketNumber,
        irsDeficiencyAmount: parseFloat(statistic.irsDeficiencyAmount),
        irsTotalPenalties: parseFloat(statistic.irsTotalPenalties),
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
