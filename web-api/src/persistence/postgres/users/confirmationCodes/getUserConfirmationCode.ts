import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/persistence/postgres/database';

export const getUserConfirmationCode = async ({
  userId,
}: {
  userId: string;
}): Promise<string | undefined> => {
  const confirmationCodeRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwUserConfirmationCode')
      .where('userId', '=', userId)
      .where('ttl', '>', Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)))
      .select(['confirmationCode'])
      .executeTakeFirst(),
  );

  if (!confirmationCodeRecord) {
    return undefined;
  }

  return confirmationCodeRecord.confirmationCode;
};
