#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'delete-users-on-case-pending - Delete from dynamodb user on case pending records ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const userOnCasePendingPageSize = 1000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getUsersOnCasePendingToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCasePending')
      .select(['userId', 'docketNumber'])
      .orderBy('userId')
      .limit(userOnCasePendingPageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let usersOnCasePendingToDelete = await getUsersOnCasePendingToDelete(offset);

  while (!isEmpty(usersOnCasePendingToDelete)) {
    const dynamoItemsToDelete = usersOnCasePendingToDelete.map(ucp => ({
      DeleteRequest: {
        Key: {
          pk: `user|${ucp.userId}`,
          sk: `pending-case|${ucp.docketNumber}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(
      `Total user on case pending records deleted so far: ${totalItemsDeleted}`,
    );
    offset += userOnCasePendingPageSize;
    usersOnCasePendingToDelete = await getUsersOnCasePendingToDelete(offset);
  }
  console.log('Done deleting user on case pending records from Dynamo');
}

main().catch(console.error);
