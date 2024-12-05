import { Statistic } from '@shared/business/entities/Statistic';
import { getDbWriter } from '@web-api/database';

export const updateCaseStatistic = async ({
  statistic,
}: {
  statistic: Statistic;
}): Promise<Statistic> => {
  const updatedStatistic = await getDbWriter(writer =>
    writer
      .updateTable('dwCaseStatistic')
      .set({
        irsDeficiencyAmount: parseFloat(statistic.irsDeficiencyAmount),
        irsTotalPenalties: parseFloat(statistic.irsTotalPenalties),
        year: parseInt(statistic.year),
        yearOrPeriod: statistic.yearOrPeriod,
      })
      .where('statisticId', '=', statistic.statisticId)
      .returningAll()
      .executeTakeFirst(),
  );

  return new Statistic(updatedStatistic);
};
