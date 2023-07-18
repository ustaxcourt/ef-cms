const { DateTime } = require('luxon');
const { IAM } = require('aws-sdk');

const iamClient = new IAM({ region: 'us-east-1' });
const month = DateTime.now().quarter * 3 - 2;
export const getStartOfCurrentQuarter = () => {
  return DateTime.fromObject({
    month,
    year: DateTime.now().year,
  });
};
const startOfCurrentQuarter = getStartOfCurrentQuarter();

/**
 * cycle through all of the users in the current AWS account and check the age of their credentials
 */
const checkUsers = async () => {
  const { Users } = await iamClient.listUsers({ MaxItems: 1000 }).promise();
  await Promise.all(Users.map(checkCredentialsForUser));
  return 'done';
};

/**
 * check to see if they have any expired credentials for the specified UserName
 *
 * @param {object} providers che providers array
 * @param {string} providers.UserName the unique identifier of the user to lookup
 */
const checkCredentialsForUser = async ({ UserName }) => {
  const { AccessKeyMetadata } = await iamClient
    .listAccessKeys({ UserName })
    .promise();

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
