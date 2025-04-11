#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';
import { applicationContext } from '@web-api/applicationContext';
import { getDynamoClient } from '@web-api/persistence/dynamo/getDynamoClient';

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
parseArgsAndEnvVars(scriptConfig);

const docketEntryPageSize = 10000;
const dynamoDbClient = getDynamoClient(applicationContext, {
  useMainRegion: false,
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
  console.log(docketEntriesToDelete.length);

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
      environment.dynamoDbTableName,
    );
    console.log(`Total docket entries deleted so far: ${totalItemsDeleted}`);
    offset += docketEntryPageSize;
    docketEntriesToDelete = await getDocketEntriesToDelete(offset);
  }
  console.log('Done deleting case docketEntries from Dynamo');
}

main().catch(console.error);
