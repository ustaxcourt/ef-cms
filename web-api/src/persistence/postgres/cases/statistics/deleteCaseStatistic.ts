import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteCaseStatistic = async ({
  statisticId,
}: {
  statisticId: string;
}): Promise<number> => {
  const statisticsDeletionResult = await pgDeleteFrom({
    table: 'dwCaseStatistic',
    where: cb => cb.where('statisticId', '=', statisticId),
  });

  await pgDeleteFrom({
    table: 'dwStatisticPenalty',
    where: cb => cb.where('statisticId', '=', statisticId),
  });

  // Num statistics deleted
  return statisticsDeletionResult.length;
};
