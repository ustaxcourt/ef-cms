import { getDbReader } from '@web-api/persistence/postgres/database';

export const verifyCaseForUser = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}): Promise<boolean> => {
  const result = await getDbReader(db =>
    db
      .selectFrom('dwUserOnCase')
      .where('docketNumber', '=', docketNumber)
      .where('userId', '=', userId)
      .select('docketNumber')
      .execute(),
  );

  return !!result.length;
};
