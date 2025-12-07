import {
  getUserByEmail,
  getAllUserEmailsInCognito,
} from '../cognito/cognito-helpers';
import { getCypressPostgresDb } from './getCypressPostgresDb';
import { formatNow } from '../../../../shared/src/business/utilities/DateHandler';

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
      .where('ttl', '>', Math.floor(formatNow('UNIX_TIMESTAMP_MS') / 1000))
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

  const deleteUserOnCaseRecords = dbConnection
    .deleteFrom('dwUserOnCase')
    .where('userId', '=', userId)
    .execute();

  await Promise.allSettled([deleteUserRecord, deleteUserOnCaseRecords]);
}

export async function getPractitionerEmailById({
  userId,
}: {
  userId: string;
}): Promise<string> {
  const dbConnection = await getCypressPostgresDb();

  const result = await dbConnection
    .selectFrom('dwUser')
    .where('userId', '=', userId)
    .select('email')
    .executeTakeFirst();

  return result?.email || '';
}

export async function getPractionerWithMostCasesEmail(): Promise<string> {
  const dbConnection = await getCypressPostgresDb();

  const cognitoEmails = await getAllUserEmailsInCognito();

  // get id of cognito user with most cases
  const uc = dbConnection
    .selectFrom('dwUserOnCase')
    .select(['userId', dbConnection.fn.countAll().as('cnt')])
    .where('actingAsRole', 'in', ['irsPractitioner', 'privatePractitioner'])
    .where('serviceIndicator', '=', 'Electronic')
    .groupBy('userId')
    .as('uc');
  const u = dbConnection
    .selectFrom('dwUser as u')
    .select(['userId'])
    .where('u.accountStatus', '=', 'active')
    .where('email', 'in', cognitoEmails)
    .as('u');
  const user = await dbConnection
    .selectFrom(uc)
    .innerJoin(u, 'uc.userId', 'u.userId')
    .selectAll('uc')
    .selectAll('u')
    // .where('uc.cnt', '<=', 500)
    .orderBy('uc.cnt', 'desc')
    .limit(1)
    .executeTakeFirst();

  // i need to figure out the out put of this...
  const id = user?.userId || '';
  // console.log('ID: ', id);
  // get the email using getPractitionerEmailById function or with initial query
  const email = getPractitionerEmailById({ userId: id });
  // console.log('email: ', email);
  return email;
}
