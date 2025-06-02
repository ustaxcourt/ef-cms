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
    'delete-users - Delete from dynamodb user entities ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const userPageSize = 1000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getUsersToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUser')
      .select(['userId'])
      .orderBy('userId')
      .limit(userPageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let usersToDelete = await getUsersToDelete(offset);

  while (!isEmpty(usersToDelete)) {
    const dynamoItemsToDelete = usersToDelete.map(u => ({
      DeleteRequest: {
        Key: {
          pk: `user|${u.userId}`,
          sk: `user|${u.userId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(`Total users deleted so far: ${totalItemsDeleted}`);
    offset += userPageSize;
    usersToDelete = await getUsersToDelete(offset);
  }
  console.log('Done deleting users from Dynamo');
}

main().catch(console.error);
