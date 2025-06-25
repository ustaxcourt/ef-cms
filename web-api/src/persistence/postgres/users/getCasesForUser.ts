import { getDbReader } from '@web-api/database';

export const getCasesForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<{ docketNumber: string }[]> => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase')
      .where('userId', '=', userId)
      .select('docketNumber')
      .execute(),
  );
};

export const getDocketNumbersByUser = async ({
  userId,
}: {
  userId: string;
}): Promise<string[]> => {
  const cases = await getCasesForUser({
    userId,
  });
  return cases.map(c => c.docketNumber);
};
