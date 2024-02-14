// usage: npx ts-node --transpile-only scripts/run-once-scripts/move-migration-records-to-main-table.ts

import { BatchWriteCommand, DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['ENV', 'SOURCE_TABLE']);

const environment = process.env.ENV!;
const sourceTable = process.env.SOURCE_TABLE!;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
  const documentClient = DynamoDBDocument.from(dynamodb);

  const scanCommand = new ScanCommand({
    TableName: `efcms-deploy-${environment}`,
  });

  const { Items } = await documentClient.send(scanCommand);

  if (!Items || Items.length === 0) {
    console.error(`efcms-deploy-${environment} is empty. Exiting.`);
    process.exit(1);
  }

  const migrationRecords = Items.filter(item =>
    item.pk.S?.includes('migration|'),
  );

  if (!migrationRecords || migrationRecords.length === 0) {
    console.error('No migration records found. Exiting.');
    process.exit(1);
  }

  const putRequests = migrationRecords.map(record => ({
    PutRequest: {
      Item: { ...record, pk: 'migration' },
    },
  }));

  const writeCommand = new BatchWriteCommand({
    RequestItems: {
      [sourceTable]: putRequests,
    },
  });
  await documentClient.send(writeCommand);

  console.log(`Migrated ${migrationRecords.length} records to ${sourceTable}.`);
})();
