import { DateTime } from 'luxon';
import {
  IAMClient,
  ListAccessKeysCommand,
  ListUsersCommand,
} from '@aws-sdk/client-iam';

const iamClient = new IAMClient({ region: 'us-east-1' });
const MaxItems = 1000;
export const getStartOfCurrentQuarter = (dateTime: any): any => {
  const month = dateTime.quarter * 3 - 2;
  return DateTime.fromObject({
    month,
    year: Number(dateTime.year),
  });
};
const startOfCurrentQuarter = getStartOfCurrentQuarter(DateTime.now());

/**
 * cycle through all of the users in the current AWS account and check the age of their credentials
 */
const checkUsers = async (): Promise<string> => {
  const listUsersCommand = new ListUsersCommand({ MaxItems });
  const { Users } = await iamClient.send(listUsersCommand);
  await Promise.all(Users.map(checkCredentialsForUser));
  return 'done';
};

/**
 * check to see if they have any expired credentials for the specified UserName
 *
 * @param {object} providers che providers array
 * @param {string} providers.UserName the unique identifier of the user to lookup
 */
const checkCredentialsForUser = async ({
  UserName,
}: {
  UserName: string;
}): Promise<void> => {
  const listAccessKeysCommand = new ListAccessKeysCommand({ UserName });
  const { AccessKeyMetadata } = await iamClient.send(listAccessKeysCommand);

  const hasExpired =
    AccessKeyMetadata.map(({ CreateDate }) =>
      DateTime.fromJSDate(CreateDate),
    ).filter(
      dateObj => dateObj.startOf('day') < startOfCurrentQuarter.startOf('day'),
    ).length > 0;

  if (hasExpired) {
    console.log(`❗ ${UserName} has keys that are expired`);
  }
};

checkUsers().then(resp => {
  console.log(resp);
});
