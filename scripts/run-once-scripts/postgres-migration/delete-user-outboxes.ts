/**
 * HOW TO RUN
 * npx ts-node --transpileOnly scripts/run-once-scripts/postgres-migration/delete-user-outboxes.ts
 */

import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '../../../web-api/src/environment';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsDeleted = 0;

async function main() {
  const scanParams: ScanCommandInput = {
    TableName: environment.dynamoDbTableName,
    TotalSegments: 10,
  };

  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      runSegmentScan({ ...scanParams, Segment: segment }, dynamoDbDocClient),
    ),
  );

  console.log(`Total user outboxes deleted: ${totalItemsDeleted}`);
}

async function runSegmentScan(
  params: ScanCommandInput,
  client: DynamoDBDocumentClient,
) {
  const result = await client.send(new ScanCommand(params));
  const items = result.Items ?? [];

  const itemsToDelete = items
    .filter(item => {
      const { pk } = item as { pk: string; sk?: string };
      return pk.startsWith('user-outbox|');
    })
    .map(item => ({
      DeleteRequest: {
        Key: {
          pk: item.pk,
          sk: item.sk,
        },
      },
    }));

  const itemsDeletedCount = await batchDeleteDynamoItems(
    itemsToDelete,
    client,
    environment.dynamoDbTableName,
  );
  totalItemsDeleted += itemsDeletedCount;

  console.log(`Items deleted so far: ${totalItemsDeleted}`);

  if (result.LastEvaluatedKey) {
    params.ExclusiveStartKey = result.LastEvaluatedKey;
    await runSegmentScan(params, client);
  }
}

main().catch(console.error);
