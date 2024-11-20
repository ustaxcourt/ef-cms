/**
 * HOW TO RUN
 *
 * TABLE_NAME=testing npx ts-node --transpileOnly scripts/postgres/delete-section-outboxes.ts
 */

import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from '../../../shared/admin-tools/util';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';

requireEnvVars(['TABLE_NAME']);

const tableNameInput = process.env.TABLE_NAME!;

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsDeleted = 0;

async function main() {
  const scanParams: ScanCommandInput = {
    TableName: tableNameInput,
    TotalSegments: 10,
  };

  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      runSegmentScan({ ...scanParams, Segment: segment }, dynamoDbDocClient),
    ),
  );

  console.log(`Total section outboxes deleted: ${totalItemsDeleted}`);
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
      return pk.startsWith('section-outbox|');
    })
    .map(item => ({
      DeleteRequest: {
        Key: {
          pk: item.pk,
        },
      },
    }));

  const itemsDeletedCount = await batchDeleteDynamoItems(
    itemsToDelete,
    client,
    tableNameInput,
  );
  totalItemsDeleted += itemsDeletedCount;

  if (result.LastEvaluatedKey) {
    params.ExclusiveStartKey = result.LastEvaluatedKey;
    await runSegmentScan(params, client);
  }
}

main().catch(console.error);
