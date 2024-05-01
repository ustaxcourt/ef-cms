import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { getMigrationFiles } from './migrationFilesHelper';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['DESTINATION_TABLE']);

const { DESTINATION_TABLE } = process.env;

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocument.from(dynamodb);

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
  const migrationFiles = getMigrationFiles();
  for (let migrationFile of migrationFiles) {
    await trackMigration(migrationFile);
  }
})();
