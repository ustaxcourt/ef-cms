#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Agent } from 'https';

const scriptConfig: ScriptConfig = {
  description:
    'delete-all-docket-entries - Delete from dynamodb docket entries ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: false,
};
const { sourceTable } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  sourceTable: string;
};

const docketEntryPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({
  maxAttempts: 5,
  region: 'us-east-1',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 5000,
  }),
});
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);
// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getDocketEntriesToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .select(['docketNumber', 'docketEntryId'])
      .orderBy('docketNumber')
      .orderBy('docketEntryId')
      .limit(docketEntryPageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let docketEntriesToDelete = await getDocketEntriesToDelete(offset);

  while (!isEmpty(docketEntriesToDelete)) {
    const dynamoItemsToDelete = docketEntriesToDelete.map(cd => ({
      DeleteRequest: {
        Key: {
          pk: `case|${cd.docketNumber}`,
          sk: `docket-entry|${cd.docketEntryId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      sourceTable,
    );
    console.log(`Total docket entries deleted so far: ${totalItemsDeleted}`);
    offset += docketEntryPageSize;
    docketEntriesToDelete = await getDocketEntriesToDelete(offset);
  }
  console.log('Done deleting case docketEntries from Dynamo');
}

main().catch(console.error);
