import { getDbReader } from '@web-api/database';

export const verifyPendingCaseForUser = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}): Promise<boolean> => {
  const userOnCaseRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCasePending as uocp')
      .where('uocp.userId', '=', userId)
      .where('uocp.docketNumber', '=', docketNumber)
      .select(['uocp.userId', 'uocp.docketNumber'])
      .executeTakeFirst(),
  );

  return !!userOnCaseRecord;
};
