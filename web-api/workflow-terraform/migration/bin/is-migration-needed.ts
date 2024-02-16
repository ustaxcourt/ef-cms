import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getMigrationFiles } from './migrationFilesHelper';
import { requireEnvVars } from '../../../../shared/admin-tools/util';

requireEnvVars(['SOURCE_TABLE']);

const { SOURCE_TABLE } = process.env;

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocument.from(dynamodb);

const hasMigrationRan = async key => {
  const getItemCommand = new GetItemCommand({
    Key: {
      pk: { S: 'migration' },
      sk: { S: `migration|${key}` },
    },
    TableName: SOURCE_TABLE,
  });
  const { Item } = await docClient.send(getItemCommand);
  return !!Item;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const migrationFiles = getMigrationFiles();
  for (let migrationFile of migrationFiles) {
    const hasRan = await hasMigrationRan(migrationFile);
    if (!hasRan) {
      console.log(
        `${migrationFile} has not run, migration is needed, exiting with status code 0`,
      );
      process.exit(0);
    }
  }
  console.log('migration is NOT needed, exiting with status code 1');
  process.exit(1);
})();
