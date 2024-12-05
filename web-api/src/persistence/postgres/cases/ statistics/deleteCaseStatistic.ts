import { getDbWriter } from '@web-api/database';

export const deleteCaseStatistic = async ({
  statisticId,
}: {
  statisticId: string;
}): Promise<number> => {
  const result = await getDbWriter(writer =>
    writer
      .deleteFrom('dwCaseStatistic')
      .where('statisticId', '=', statisticId)
      .execute(),
  );

  // Rows affected
  return result.length;
};
