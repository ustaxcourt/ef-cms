/**
 * This script is to grant the user running it the ability to become the specified
 * UserId by utilizing the custom:userId attribute
 *
 * You must have the following Environment variables set:
 * - ENV: The name of the environment you are working with (mig)
 * - COGNITO_USER_EMAIL: The email address you use to access this environment (your.email@example.com)
 * - COGNITO_USER_POOL: The Cognito User Pool for the environment (us-east-1_ExAmPlES)
 *
 * Example usage:
 *
 * $ npm run admin:become-user 432143213-4321-1234-4321-432143214321
 */
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { checkEnvVar, getVersion } from '../util';

const { COGNITO_USER_EMAIL, COGNITO_USER_POOL, ENV } = process.env;

checkEnvVar(
  COGNITO_USER_POOL,
  'You must have COGNITO_USER_POOL set in your environment',
);
checkEnvVar(
  COGNITO_USER_EMAIL,
  'You must have COGNITO_USER_EMAIL set in your environment; This is the email address you use for Cognito',
);
checkEnvVar(ENV, 'You must have ENV set in your environment; (e.g., mig)');

const usage = () => {
  console.log(`Assume the account of another user in the system. 

  You must have the following Environment variables set:

  - ENV: The name of the environment you are working with (mig)
  - COGNITO_USER_EMAIL: The email address you use to access this environment (your.email@example.com)
  - COGNITO_USER_POOL: The Cognito User Pool for the environment (us-east-1_ABCdefGHI)
  
  Usage:

  You can assume the role of any user's role with the following command. The script will randomly choose between
  users in the system that match the specified role

  $ npm run admin:become-user <USER_ID>
  
  - USER_ID: The specific UUID of the user in the system 

  You must have the following 

  Example:

  $ npm run admin:become-user 7331b076-4321-1234-4321-abc123def456

`);
  process.exit();
};

if (process.argv.length < 3) {
  usage();
}

/**
 * Lookup a role for the specified userId
 *
 * @param {String} userId The unique identifier of the user
 * @returns {String} The role found for the user
 */
const lookupRoleForUser = async userId => {
  const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
  const documentClient = DynamoDBDocument.from(dynamodb, {
    marshallOptions: { removeUndefinedValues: true },
  });
  const version = await getVersion();
  const TableName = `efcms-${ENV}-${version}`;
  const data = await documentClient.get({
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    ProjectionExpression: '#role',
    TableName,
  });

  if (!data) {
    throw new Error(`Could not find a user for ${userId}`);
  }
  return data.Item?.role;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const userId = process.argv[2];
    const role = await lookupRoleForUser(userId);
    const params = {
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: role,
        },
        {
          Name: 'custom:userId',
          Value: userId,
        },
      ],
      UserPoolId: COGNITO_USER_POOL,
      Username: COGNITO_USER_EMAIL,
    };

    console.log(params);

    const cognito = new CognitoIdentityProvider({
      region: 'us-east-1',
    });
    const result = await cognito.adminUpdateUserAttributes(params);

    console.log(result);
    console.log('SUCCESS: Please log out and log back in again');
  } catch (err) {
    console.log('ERROR: ', err);
  }
})();
