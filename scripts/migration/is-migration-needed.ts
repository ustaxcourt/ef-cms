#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { migrationsToRun } from '@web-api/lambdas/migration/migrationsToRun';

const scriptConfig: ScriptConfig = {
  description:
    'is-migration-needed - Exits with a success code if a migration is needed or an error code if not',
  environment: {
    TableName: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
const { TableName } = parseArgsAndEnvVars(scriptConfig) as {
  TableName: string;
};

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocument.from(dynamodb);

const hasMigrationRan = async key => {
  const getItemCommand = new GetItemCommand({
    Key: {
      pk: { S: 'migration' },
      sk: { S: `migration|${key}` },
    },
    TableName,
  });
  const { Item } = await docClient.send(getItemCommand);
  return !!Item;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  for (const { key } of migrationsToRun) {
    const hasRan = await hasMigrationRan(key);
    if (!hasRan) {
      console.log(
        `${key} has not run, migration is needed, exiting with status code 0`,
      );
      process.exit(0);
    }
  }
  console.log('migration is NOT needed, exiting with status code 1');
  process.exit(1);
})();
