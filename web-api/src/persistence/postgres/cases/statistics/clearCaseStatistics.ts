import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import { isEmpty } from 'lodash';

export const clearCaseStatistics = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<number> => {
  const statisticsDeletionResult = await pgDeleteFrom({
    table: 'dwCaseStatistic',
    where: cb => cb.where('docketNumber', '=', docketNumber),
  });

  const statisticIds = statisticsDeletionResult.map(s => s.statisticId);
  if (!isEmpty(statisticIds)) {
    await pgDeleteFrom({
      table: 'dwStatisticPenalty',
      where: cb => cb.where('statisticId', 'in', statisticIds),
    });
  }

  return statisticIds.length;
};
