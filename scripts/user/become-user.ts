#!/usr/bin/env -S npx ts-node --transpile-only

// ⚠️ WARNING ⚠️
// THIS SCRIPT IS BROKEN AFTER THE POSTGRES REFACTORING.  YOU WILL NEED TO UPDATE IT IF YOU PLAN TO RUN IT
// ⚠️ WARNING ⚠️

import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    "become-user - Overwrites your cognito user's custom:userId attribute with the provided user id.",
  environment: {
    TableName: 'DYNAMODB_TABLE_NAME',
    UserPoolId: 'COGNITO_USER_POOL',
    Username: 'COGNITO_USER_EMAIL',
    env: 'ENV',
  },
  parameters: {
    userId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { TableName, userId, Username, UserPoolId } = parseArgsAndEnvVars(
  scriptConfig,
) as { [k: string]: string };

const usage = () => {
  console.log(`Assume the account of another user in the system. 

  You must have the following Environment variables set:

  - ENV: The name of the environment you are working with (mig)
  - COGNITO_USER_EMAIL: The email address you use to access this environment (your.email@example.com)
  - COGNITO_USER_POOL: The Cognito User Pool for the environment (us-east-1_ABCdefGHI)
  - DYNAMODB_TABLE_NAME: The name of this environment's source dynamodb table (efcms-mig-beta)
  
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

const lookupRoleForUser = async (id: string): Promise<string> => {
  const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
  const documentClient = DynamoDBDocument.from(dynamodb, {
    marshallOptions: { removeUndefinedValues: true },
  });
  const data = await documentClient.get({
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    Key: {
      pk: `user|${id}`,
      sk: `user|${id}`,
    },
    ProjectionExpression: '#role',
    TableName,
  });

  if (
    !data ||
    !('Item' in data) ||
    !data.Item ||
    !('role' in data.Item) ||
    !data.Item.role
  ) {
    throw new Error(`Could not find a user for ${id}`);
  }
  return data.Item.role;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
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
      UserPoolId,
      Username,
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
