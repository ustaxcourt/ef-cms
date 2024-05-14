import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { migrationsToRun } from '@web-api/lambdas/migration/migrationsToRun';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['DESTINATION_TABLE']);

const { DESTINATION_TABLE } = process.env;

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocument.from(dynamodb);

const trackMigration = async (key: string) => {
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
  const migrationFiles = migrationsToRun;
  for (let { key } of migrationFiles) {
    await trackMigration(key);
  }
})();
