import {
  getAllUserEmailsInCognito,
  getUserByEmail,
} from '../cognito/cognito-helpers';
import { getCypressPostgresDb } from './getCypressPostgresDb';
import {
  calculateISODate,
  formatNow,
  getJsDateFromIso,
} from '@shared/business/utilities/DateHandler';
import { sql } from 'kysely';

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
      .where('ttl', '>', parseInt(formatNow('UNIX_TIMESTAMP_SECONDS')))
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

export async function getPractionerWithMostCasesEmail(): Promise<string> {
  const dbConnection = await getCypressPostgresDb();

  const cognitoEmails = await getAllUserEmailsInCognito();

  // get id of cognito user with most cases
  const result = await dbConnection
    .selectFrom('dwUser as u')
    .innerJoin('dwUserOnCase as uc', 'uc.userId', 'u.userId')
    .select(({ fn }) => [
      'u.email',
      fn.count<number>('uc.docketNumber').as('caseCount'),
    ])
    .where('uc.actingAsRole', 'in', ['irsPractitioner', 'privatePractitioner'])
    .where('uc.serviceIndicator', '=', 'Electronic')
    .where('u.accountStatus', '=', 'active')
    .where('u.email', 'in', cognitoEmails)
    .groupBy('u.userId')
    .orderBy('caseCount', 'desc')
    .limit(1)
    .executeTakeFirst();
  return result?.email || '';
}

export async function getOpenAndRecentCasesByEmail(
  email: string,
): Promise<string[]> {
  const { userId } = await getUserByEmail(email);
  if (!userId) return [];

  const dbConnection = await getCypressPostgresDb();

  const cases = await dbConnection
    .selectFrom('dwUserOnCase')
    .where('userId', '=', userId)
    .select(['docketNumber'])
    .execute();

  const sixMonthsAgo = calculateISODate({
    howMuch: -6,
    units: 'months',
  });

  const openAndRecentCases = await dbConnection
    .selectFrom('dwCase')
    .where(
      'docketNumber',
      'in',
      cases.map(c => c.docketNumber),
    )
    .where(
      sql<boolean>`(closed_date IS NULL OR closed_date >= ${sixMonthsAgo})`,
    )
    .select(['docketNumber'])
    .execute()
    .then(results => results.map(r => r.docketNumber));

  return openAndRecentCases.filter(
    (docketNumber): docketNumber is string => docketNumber !== null,
  );
}

export async function getRecentEventsByCode(
  eventCode: string,
  cases: string[],
  dateStart: string,
): Promise<{ [docketNumber: string]: string }> {
  const dbConnection = await getCypressPostgresDb();

  return await dbConnection
    .selectFrom('dwDocketEntry')
    .where('docketNumber', 'in', cases)
    .where('eventCode', '=', eventCode)
    .where('createdAt', '>=', getJsDateFromIso(dateStart))
    .select(['eventCode', 'docketNumber'])
    .execute()
    .then(results => {
      const casesObject: { [docketNumber: string]: string } = {};
      for (const result of results) {
        const { eventCode, docketNumber } = result;
        casesObject[docketNumber] = eventCode;
      }

      return casesObject;
    });
}

export async function getDocketEntryIdsByDocketNumberAndEventCode({
  docketNumber,
  eventCode,
}: {
  docketNumber: string;
  eventCode: string;
}): Promise<{ docketEntryId: string }[]> {
  const dbConnection = await getCypressPostgresDb();

  return await dbConnection
    .selectFrom('dwDocketEntry')
    .where('docketNumber', '=', docketNumber)
    .where('eventCode', '=', eventCode)
    .select(['docketEntryId'])
    .execute();
}
