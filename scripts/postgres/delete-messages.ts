import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from 'shared/admin-tools/util';

// Ensure required environment variables are set
requireEnvVars(['TABLE_NAME']);

// Table name configured via environment variable
const tableNameInput = process.env.TABLE_NAME!;

// Set up DynamoDB client with AWS SDK v3
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsDeleted = 0; // Counter for tracking total deleted items

async function main() {
  // Set up scan parameters
  const scanParams: ScanCommandInput = {
    TableName: tableNameInput,
    TotalSegments: 10, // Enable parallel scans with 10 segments
  };

  // Run scans concurrently across segments
  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      runSegmentScan({ ...scanParams, Segment: segment }, dynamoDbDocClient),
    ),
  );

  console.log(`Total messages deleted: ${totalItemsDeleted}`);
}

async function runSegmentScan(
  params: ScanCommandInput,
  client: DynamoDBDocumentClient,
) {
  const result = await client.send(new ScanCommand(params));
  const items = result.Items ?? [];

  // Filter the items that match the condition and prepare for batch delete
  const itemsToDelete = items
    .filter(item => {
      const { pk, sk } = item as { pk: string; sk: string };
      return pk.startsWith('case|') && sk.startsWith('message|');
    })
    .map(item => ({
      DeleteRequest: {
        Key: {
          pk: item.pk,
          sk: item.sk,
        },
      },
    }));

  await batchDeleteItems(itemsToDelete, client);

  // Continue scanning if there's more data
  if (result.LastEvaluatedKey) {
    params.ExclusiveStartKey = result.LastEvaluatedKey;
    await runSegmentScan(params, client);
  }
}

async function batchDeleteItems(
  itemsToDelete: { DeleteRequest: { Key: { pk: string; sk: string } } }[],
  client: DynamoDBDocumentClient,
) {
  // DynamoDB batch write supports a maximum of 25 items per request
  const BATCH_SIZE = 25;

  for (let i = 0; i < itemsToDelete.length; i += BATCH_SIZE) {
    const batch = itemsToDelete.slice(i, i + BATCH_SIZE);

    const batchWriteParams = {
      RequestItems: {
        [tableNameInput]: batch,
      },
    };

    try {
      let unprocessedItems: any[] = batch;
      let retryCount = 0;
      const MAX_RETRIES = 5;

      // Retry logic for unprocessed items
      while (unprocessedItems.length > 0 && retryCount < MAX_RETRIES) {
        const response = await client.send(
          new BatchWriteCommand(batchWriteParams),
        );

        totalItemsDeleted +=
          unprocessedItems.length -
          (response.UnprocessedItems?.[tableNameInput]?.length || 0);

        unprocessedItems = response.UnprocessedItems?.[tableNameInput] ?? [];

        if (unprocessedItems.length > 0) {
          console.log(
            `Retrying unprocessed items: ${unprocessedItems.length}, attempt ${retryCount + 1}`,
          );
          batchWriteParams.RequestItems[tableNameInput] = unprocessedItems;
          retryCount++;
        }
      }

      if (unprocessedItems.length > 0) {
        console.error(
          `Failed to delete ${unprocessedItems.length} items after ${MAX_RETRIES} retries.`,
        );
      }
    } catch (error) {
      console.error('Error in batch delete:', error);
    }
  }
}

main().catch(console.error);
