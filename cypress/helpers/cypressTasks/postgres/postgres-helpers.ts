import { getUserByEmail } from '../cognito/cognito-helpers';
import { getCypressPostgresDb } from './getCypressPostgresDb';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';

export const getNewAccountVerificationCode = async ({
  email,
}: {
  email: string;
}): Promise<{
  userId: string | undefined;
  confirmationCode: string | undefined;
}> => {
  const { userId } = await getUserByEmail(email);
  if (!userId)
    return {
      confirmationCode: undefined,
      userId: undefined,
    };

  const dbConnection = await getCypressPostgresDb();
  const { confirmationCode } =
    (await dbConnection
      .selectFrom('dwUserConfirmationCode')
      .where('userId', '=', userId)
      .where('expiresAt', '>', calculateDate({ dateString: formatNow() }))
      .select(['confirmationCode'])
      .executeTakeFirst()) ?? {};

  return {
    confirmationCode,
    userId,
  };
};

export const expireUserConfirmationCode = async (
  email: string,
): Promise<null> => {
  const { userId } = await getUserByEmail(email);
  if (!userId) return null;

  const dbConnection = await getCypressPostgresDb();
  await dbConnection
    .deleteFrom('dwUserConfirmationCode')
    .where('userId', '=', userId)
    .execute();

  return null;
};

export const getEmailVerificationToken = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const { userId } = await getUserByEmail(email);
  if (!userId) return '';

  const dbConnection = await getCypressPostgresDb();
  const user = await dbConnection
    .selectFrom('dwUser')
    .where('userId', '=', userId)
    .select(['pendingEmailVerificationToken'])
    .executeTakeFirst();

  return user?.pendingEmailVerificationToken || '';
};

export async function deleteAllUserRecords({
  userId,
}: {
  userId: string;
}): Promise<void> {
  const dbConnection = await getCypressPostgresDb();

  const deleteUserRecord = dbConnection
    .deleteFrom('dwUser')
    .where('userId', '=', userId)
    .execute();

  const deletePractitionerRecord = dbConnection
    .deleteFrom('dwPractitioner')
    .where('userId', '=', userId)
    .execute();

  const deleteUserOnCaseRecords = dbConnection
    .deleteFrom('dwUserOnCase')
    .where('userId', '=', userId)
    .execute();

  await Promise.allSettled([
    deleteUserRecord,
    deletePractitionerRecord,
    deleteUserOnCaseRecords,
  ]);
}
