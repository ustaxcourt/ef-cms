#!/usr/bin/env -S npx ts-node --transpile-only

import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { applicationContext } from '@web-api/applicationContext';
import { RawUser } from '@shared/business/entities/User';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

const scriptConfig: ScriptConfig = {
  description:
    'delete-test-users - Deletes users created by the setup-test-users script',
  environment: {
    env: 'ENV',
    TableName: 'SOURCE_TABLE',
    UserPoolId: 'COGNITO_USER_POOL',
  },
  requireActiveAwsSession: true,
};
const { TableName, UserPoolId } = parseArgsAndEnvVars(scriptConfig) as {
  TableName: string;
  UserPoolId: string;
};
const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
});

const getAllTestUsers = async (): Promise<RawUser[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: {
              term: {
                'lastName.S': 'Test',
              },
            },
          },
        },
      },
      index: 'efcms-user',
    },
  });
  return results;
};

const deleteUserFromDynamo = async ({
  user,
}: {
  user: RawUser;
}): Promise<boolean> => {
  let deletedMapping = false;
  const sectionMappingKey = {
    pk: { S: `section|${user.section}` },
    sk: { S: `user|${user.userId}` },
  };
  const deleteMappingItemCommand = new DeleteItemCommand({
    Key: sectionMappingKey,
    TableName,
  });
  try {
    await dynamoClient.send(deleteMappingItemCommand);
    deletedMapping = true;
  } catch (err) {
    console.error(`ERROR deleting section mapping for ${user.name}:`, err);
  }

  let deletedUser = false;
  const userKey = {
    pk: { S: `user|${user.userId}` },
    sk: { S: `user|${user.userId}` },
  };
  const deleteUserItemCommand = new DeleteItemCommand({
    Key: userKey,
    TableName,
  });
  try {
    await dynamoClient.send(deleteUserItemCommand);
    deletedUser = true;
  } catch (err) {
    console.error(`ERROR deleting user ${user.name} from dynamo:`, err);
  }
  console.log(`Deleted user ${user.name} from dynamo`);

  return deletedMapping && deletedUser;
};

const deleteUserFromCognito = async ({
  user,
}: {
  user: RawUser;
}): Promise<boolean> => {
  let disabledUser = false;
  let deletedUser = false;
  const { Users } = await cognito.listUsers({
    AttributesToGet: ['email', 'sub'],
    Filter: `email = "${user.email}"`,
    UserPoolId,
  });
  if (!Users || Users.length < 1) {
    console.error(`ERROR deleting user ${user.name} from cognito`);
    return false;
  }
  for (const cognitoUser of Users) {
    const { Username } = cognitoUser;
    try {
      await cognito.adminDisableUser({ UserPoolId, Username });
      disabledUser = true;
    } catch (err: any) {
      console.error(`ERROR disabling user ${user.name} from cognito:`, err);
    }
    try {
      await cognito.adminDeleteUser({ UserPoolId, Username });
      deletedUser = true;
    } catch (err: any) {
      console.error(`ERROR deleting user ${user.name} from cognito:`, err);
    }
    console.log(`Deleted user ${user.name} from cognito`);
  }

  return disabledUser && deletedUser;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const realUsersNamedTest = [
    'Stephen G. Test',
    'Robert B. Test',
    'Sandra L Test',
  ];
  const users = (await getAllTestUsers()).filter(u => {
    return !realUsersNamedTest.includes(u.name);
  });
  for (const user of users) {
    await deleteUserFromCognito({ user });
    await deleteUserFromDynamo({ user });
  }
})();
