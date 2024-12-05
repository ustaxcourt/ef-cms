import { Statistic } from '@shared/business/entities/Statistic';
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
        docketNumber,
        irsDeficiencyAmount: parseFloat(statistic.irsDeficiencyAmount),
        irsTotalPenalties: parseFloat(statistic.irsTotalPenalties),
        statisticId: statistic.statisticId,
        year: parseInt(statistic.year),
        yearOrPeriod: statistic.yearOrPeriod,
      })
      .execute(),
  );
};
