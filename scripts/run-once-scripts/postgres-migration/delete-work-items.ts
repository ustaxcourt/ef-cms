#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '../../../web-api/src/environment';
import { getDbReader } from '../../../web-api/src/database';
import { isEmpty } from 'lodash';

const workItemsPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getWorkItemsToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem')
      .select(['docketNumber', 'workItemId'])
      .orderBy('workItemId')
      .limit(workItemsPageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let workItemsToDelete = await getWorkItemsToDelete(offset);

  while (!isEmpty(workItemsToDelete)) {
    const dynamoItemsToDelete = workItemsToDelete.map(c => ({
      DeleteRequest: {
        Key: {
          pk: `case|${c.docketNumber}`,
          sk: `work-item|${c.workItemId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(`Total work items deleted so far: ${totalItemsDeleted}`);
    offset += workItemsPageSize;
    workItemsToDelete = await getWorkItemsToDelete(offset);
  }
  console.log('Done deleting work items from Dynamo');
}

main().catch(console.error);
