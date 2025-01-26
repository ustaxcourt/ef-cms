#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'delete-section-outboxes - Delete from dynamodb section-outbox entities ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsDeleted = 0;

async function main() {
  const scanParams: ScanCommandInput = {
    TableName: environment.dynamoDbTableName,
    TotalSegments: 20,
  };

  await Promise.all(
    Array.from({ length: 20 }).map((_, segment) =>
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
