import { getDbReader } from '@web-api/persistence/postgres/database';

export const getDocketNumbersByUser = async ({
  userId,
}: {
  userId: string;
}): Promise<string[]> => {
  const cases = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase')
      .where('userId', '=', userId)
      .select('docketNumber')
      .execute(),
  );
  return cases.map(c => c.docketNumber);
};
