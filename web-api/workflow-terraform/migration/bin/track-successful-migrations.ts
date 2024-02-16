import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { requireEnvVars } from '../shared/admin-tools/util';
import fs from 'fs';
import path from 'path';

requireEnvVars(['DESTINATION_TABLE']);

const { DESTINATION_TABLE } = process.env;

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocument.from(dynamodb);

const getFilesInDirectory = dir => {
  const files = fs.readdirSync(dir);
  return files.filter(
    file =>
      !file.endsWith('.test.js') &&
      !file.endsWith('.test.ts') &&
      !file.startsWith('0000'),
  );
};

const trackMigration = async key => {
  console.log(`marking migration ${key} as ran`);
  const putItemCommand = new PutItemCommand({
    Item: {
      createdAt: { S: formatNow() },
      pk: { S: 'migration' },
      sk: { S: `migration|${key}` },
    },
    TableName: DESTINATION_TABLE,
  });
  await docClient.send(putItemCommand);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const migrationFiles = getFilesInDirectory(
    path.join(
      __dirname,
      './workflow-terraform/migration/main/lambdas/migrations',
    ),
  );
  for (let migrationFile of migrationFiles) {
    await trackMigration(migrationFile);
  }
})();
