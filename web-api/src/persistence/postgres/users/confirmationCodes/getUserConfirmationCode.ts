import { getDbReader } from '@web-api/database';

export const getUserConfirmationCode = async ({
  userId,
}: {
  userId: string;
}): Promise<string | undefined> => {
  const confirmationCodeRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwUserConfirmationCode')
      .where('userId', '=', userId)
      .where('ttl', '>', Math.floor(Date.now() / 1000))
      .select(['confirmationCode'])
      .executeTakeFirst(),
  );

  if (!confirmationCodeRecord) {
    return undefined;
  }

  return confirmationCodeRecord.confirmationCode;
};
