#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'delete-case-items - Delete from dynamodb case-item entities ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const caseItemsPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getCasesToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(['docketNumber'])
      .orderBy('docketNumber')
      .limit(caseItemsPageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let caseItemsToDelete = await getCasesToDelete(offset);

  while (!isEmpty(caseItemsToDelete)) {
    const dynamoItemsToDelete = caseItemsToDelete.map(c => ({
      DeleteRequest: {
        Key: {
          pk: `case|${c.docketNumber}`,
          sk: `case|${c.docketNumber}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(`Total work items deleted so far: ${totalItemsDeleted}`);
    offset += caseItemsPageSize;
    caseItemsToDelete = await getCasesToDelete(offset);
  }
  console.log('Done deleting work items from Dynamo');
}

main().catch(console.error);
