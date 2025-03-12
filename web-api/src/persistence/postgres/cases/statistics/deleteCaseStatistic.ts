import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteCaseStatistic = async ({
  statisticId,
}: {
  statisticId: string;
}): Promise<number> => {
  const result = await pgDeleteFrom({
    table: 'dwCaseStatistic',
    where: cb => cb.where('statisticId', '=', statisticId),
  });

  // Rows affected
  return result.length;
};
