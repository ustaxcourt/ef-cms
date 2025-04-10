import { getDbReader } from '@web-api/database';

export const verifyCaseForUser = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}): Promise<boolean> => {
  const userOnCaseRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uoc')
      .where('uoc.userId', '=', userId)
      .where('uoc.docketNumber', '=', docketNumber)
      .selectAll('uoc')
      .executeTakeFirst(),
  );

  return !!userOnCaseRecord;
};
