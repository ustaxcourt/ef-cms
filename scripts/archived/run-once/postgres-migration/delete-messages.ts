#!/usr/bin/env -S npx ts-node --transpile-only

/**
 * HOW TO RUN
 *
 * TABLE_NAME=testing npx ts-node --transpileOnly scripts/run-once-scripts/postgres-migration/delete-messages.ts
 */

import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../../helpers/parseArgsAndEnvVars';
import { batchDeleteDynamoItems } from '../../../run-once-scripts/postgres-migration/batch-delete-dynamo-items';

const scriptConfig: ScriptConfig = {
  description:
    'delete-messages - Delete from dynamodb Message entities that have been migrated to postes',
  environment: {
    env: 'ENV',
    tableNameInput: 'TABLE_NAME',
  },
  requireActiveAwsSession: true,
};
const { tableNameInput } = parseArgsAndEnvVars(scriptConfig) as {
  tableNameInput: string;
};

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsDeleted = 0;

async function main() {
  // Set up scan parameters
  const scanParams: ScanCommandInput = {
    TableName: tableNameInput,
    TotalSegments: 10,
  };

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

  await batchDeleteDynamoItems(itemsToDelete, client, tableNameInput);
  totalItemsDeleted = totalItemsDeleted + itemsToDelete.length;

  if (result.LastEvaluatedKey) {
    params.ExclusiveStartKey = result.LastEvaluatedKey;
    await runSegmentScan(params, client);
  }
}

main().catch(console.error);
