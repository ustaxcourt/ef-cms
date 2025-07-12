#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'delete-case-deadlines - Delete from dynamodb case deadline entities ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const caseDeadlinePageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getCaseDeadlinesToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCaseDeadline')
      .select(['docketNumber', 'caseDeadlineId'])
      .orderBy('caseDeadlineId')
      .limit(caseDeadlinePageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let caseDeadlinesToDelete = await getCaseDeadlinesToDelete(offset);

  while (!isEmpty(caseDeadlinesToDelete)) {
    const dynamoItemsToDelete = caseDeadlinesToDelete.map(cd => ({
      DeleteRequest: {
        Key: {
          pk: `case|${cd.docketNumber}`,
          sk: `case-deadline|${cd.caseDeadlineId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(`Total case deadlines deleted so far: ${totalItemsDeleted}`);
    offset += caseDeadlinePageSize;
    caseDeadlinesToDelete = await getCaseDeadlinesToDelete(offset);
  }
  console.log('Done deleting case deadlines from Dynamo');
}

main().catch(console.error);
