#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { migrationsToRun } from '@web-api/lambdas/migration/migrationsToRun';

const scriptConfig: ScriptConfig = {
  description:
    'track-successful-migrations - Puts a migration record into the destination table for each migration that has run',
  environment: {
    destinationTable: 'DESTINATION_TABLE',
  },
  requireActiveAwsSession: true,
};
const { destinationTable } = parseArgsAndEnvVars(scriptConfig) as {
  destinationTable: string;
};

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
    TableName: destinationTable,
  });
  await docClient.send(putItemCommand);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const migrationFiles = migrationsToRun;
  for (const { key } of migrationFiles) {
    await trackMigration(key);
  }
})();
