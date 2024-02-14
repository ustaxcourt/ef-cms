// usage: npx ts-node --transpile-only scripts/run-once-scripts/move-migration-records-to-main-table.ts

import { BatchWriteCommand, DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { chunk } from 'lodash';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'SOURCE_TABLE']);

const environment = process.env.ENV!;
const mainTable = process.env.SOURCE_TABLE!;
const deployTable = `efcms-deploy-${environment}`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
  const documentClient = DynamoDBDocument.from(dynamodb);

  const scanCommand = new ScanCommand({
    TableName: deployTable,
  });

  const { Items } = await documentClient.send(scanCommand);

  if (!Items || Items.length === 0) {
    console.error(`${deployTable} is empty. Exiting.`);
    process.exit(1);
  }

  const migrationRecords = Items.filter(item =>
    item.pk.S?.includes('migration|'),
  );

  if (!migrationRecords || migrationRecords.length === 0) {
    console.error('No migration records found. Exiting.');
    process.exit(1);
  }

  const mrChunks = chunk(migrationRecords, 25);
  const promises: Promise<any>[] = [];
  for (const mrChunk of mrChunks) {
    const putRequests = mrChunk.map(record => ({
      PutRequest: {
        Item: { ...record, pk: { S: 'migration' } },
      },
    }));

    const writeCommand = new BatchWriteCommand({
      RequestItems: {
        [mainTable]: putRequests,
      },
    });
    promises.push(documentClient.send(writeCommand));

    const deleteRequests = mrChunk.map(record => ({
      DeleteRequest: {
        Key: { pk: record.pk.S, sk: record.sk.S },
      },
    }));
    const deleteCommand = new BatchWriteCommand({
      RequestItems: {
        [deployTable]: deleteRequests,
      },
    });
    promises.push(documentClient.send(deleteCommand));
  }

  await Promise.all(promises);

  console.log(
    `Migrated ${migrationRecords.length} records to ${mainTable} and deleted them from ${deployTable}.`,
  );
})();
