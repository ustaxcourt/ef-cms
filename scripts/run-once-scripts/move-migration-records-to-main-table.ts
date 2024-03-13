// usage: npx ts-node --transpile-only scripts/run-once-scripts/move-migration-records-to-main-table.ts

import { AttributeValue, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { chunk } from 'lodash';
import { getMigrationFiles } from '../../web-api/workflow-terraform/migration/bin/migrationFilesHelper';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { unmarshall } from '@aws-sdk/util-dynamodb';

requireEnvVars(['ENV', 'SOURCE_TABLE']);

const environment = process.env.ENV!;
const mainTable = process.env.SOURCE_TABLE!;
const deployTable = `efcms-deploy-${environment}`;
const migrationFiles = getMigrationFiles();

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamodb);

const scanFull = async ({ TableName }: { TableName: string }) => {
  let items: Record<string, AttributeValue>[] = [];
  let hasMoreResults = true;
  let lastKey: Record<string, AttributeValue> | undefined = undefined;

  while (hasMoreResults) {
    hasMoreResults = false;
    const nextScanCommand = new ScanCommand({ ExclusiveStartKey: lastKey, TableName });
    const results = await documentClient.send(nextScanCommand);
    hasMoreResults = !!results.LastEvaluatedKey;
    lastKey = results.LastEvaluatedKey;
    items = [...items, ...results.Items];
  }

  return items;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const items = await scanFull({ TableName: deployTable });

  if (!items || items.length === 0) {
    console.error(`${deployTable} is empty. Exiting.`);
    process.exit(1);
  }

  const migrationRecords = items.filter(item =>
    item.pk.S?.includes('migration|'),
  );

  if (!migrationRecords || migrationRecords.length === 0) {
    console.error('No migration records found. Exiting.');
    process.exit(1);
  }

  const mrChunks = chunk(migrationRecords, 25);
  const commands: BatchWriteCommand[] = [];
  let moved = 0;
  let deleted = 0;
  for (const mrChunk of mrChunks) {
    const relevantMigrationRecords = mrChunk.filter(record => {
      const filename = record.sk.S?.split('|')[1] || '';
      return migrationFiles.includes(filename);
    });
    moved += relevantMigrationRecords.length;
    const putRequests = relevantMigrationRecords.map(record => ({
      PutRequest: {
        Item: { ...unmarshall(record), pk: 'migration' },
      },
    }));
    if (putRequests.length > 0) {
      commands.push(new BatchWriteCommand({
        RequestItems: {
          [mainTable]: putRequests,
        },
      }));
    }

    const deleteRequests = mrChunk.map(record => ({
      DeleteRequest: {
        Key: { pk: record.pk.S, sk: record.sk.S },
      },
    }));
    deleted += mrChunk.length;
    if (deleteRequests.length > 0) {
      commands.push(new BatchWriteCommand({
        RequestItems: {
          [deployTable]: deleteRequests,
        },
      }));
    }
  }

  await Promise.all(commands.map(command => documentClient.send(command)));

  console.log(
    `Migrated ${moved} record${moved > 1 ? 's' : ''} to ${mainTable} and ` +
      `deleted ${deleted} record${deleted > 1 ? 's' : ''} from ${deployTable}.`,
  );
})();
