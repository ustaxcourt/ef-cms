/**
 * HOW TO RUN
 *
 * TABLE_NAME=testing npx ts-node --transpileOnly scripts/run-once-scripts/postgres-migration/delete-work-items.ts
 */

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from '../../../shared/admin-tools/util';
import { getDbReader } from '../../../web-api/src/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';

const workItemsPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

requireEnvVars(['TABLE_NAME']);

const tableNameInput = process.env.TABLE_NAME!;

const getWorkItemsToDelete = async (offset: number) => {
  const workItems = await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem')
      .select(['docketNumber', 'workItemId'])
      .orderBy('workItemId')
      .limit(workItemsPageSize)
      .offset(offset)
      .execute(),
  );
  return workItems;
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let workItemsToDelete = await getWorkItemsToDelete(offset);

  while (!isEmpty(workItemsToDelete)) {
    const dynamoItemsToDelete = workItemsToDelete.map(c => ({
      DeleteRequest: {
        Key: {
          pk: `work-item|${c.workItemId}`,
          sk: `case$|{c.docketNumber}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      tableNameInput,
    );
    console.log(`Total work items deleted so far: ${totalItemsDeleted}`);
    offset += workItemsPageSize;
    workItemsToDelete = await getWorkItemsToDelete(offset);
  }
  console.log('Done deleting work items from Dynamo');
}

main().catch(console.error);
