#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { camelCase, isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'delete-users-on-case - Delete from dynamodb user on case records ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const userOnCasePageSize = 1000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getUsersOnCaseToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase')
      .select(['userId', 'docketNumber', 'entityName'])
      .orderBy('userId')
      .limit(userOnCasePageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let usersOnCaseToDelete = await getUsersOnCaseToDelete(offset);

  while (!isEmpty(usersOnCaseToDelete)) {
    const dynamoItemsToDelete: any[] = [];
    usersOnCaseToDelete.forEach(uc => {
      dynamoItemsToDelete.push({
        DeleteRequest: {
          Key: {
            pk: `user|${uc.userId}`,
            sk: `case|${uc.docketNumber}`,
          },
        },
      });

      dynamoItemsToDelete.push({
        DeleteRequest: {
          Key: {
            pk: `case|${uc.docketNumber}`,
            sk: `${camelCase(uc.entityName)}|${uc.userId}`,
          },
        },
      });
    });

    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(
      `Total user on case records deleted so far: ${totalItemsDeleted}`,
    );
    offset += userOnCasePageSize;
    usersOnCaseToDelete = await getUsersOnCaseToDelete(offset);
  }
  console.log('Done deleting user on case records from Dynamo');
}

main().catch(console.error);
