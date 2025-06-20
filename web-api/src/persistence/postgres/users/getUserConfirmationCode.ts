import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
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
      .where('expiresAt', '>', calculateDate({ dateString: formatNow() }))
      .select(['confirmationCode'])
      .executeTakeFirst(),
  );

  if (!confirmationCodeRecord) {
    return undefined;
  }

  return confirmationCodeRecord.confirmationCode;
};
