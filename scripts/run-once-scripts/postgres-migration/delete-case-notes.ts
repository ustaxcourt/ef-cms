#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { isEmpty } from 'lodash';

const scriptConfig: ScriptConfig = {
  description:
    'delete-case-notes - Delete from dynamodb CaseNote entities that have been migrated to postes',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const caseUserNotesPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getCaseNotesToDelete = async (offset: number) => {
  const caseNotes = await getDbReader(reader =>
    reader
      .selectFrom('dwUserCaseNote')
      .select(['docketNumber', 'userId'])
      .orderBy(['docketNumber', 'userId'])
      .limit(caseUserNotesPageSize)
      .offset(offset)
      .execute(),
  );
  return caseNotes;
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let caseNotesToDelete = await getCaseNotesToDelete(offset);

  while (!isEmpty(caseNotesToDelete)) {
    const dynamoItemsToDelete = caseNotesToDelete.map(c => ({
      DeleteRequest: {
        Key: {
          pk: `user-case-note|${c.docketNumber}`,
          sk: `user|${c.userId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(`Total case notes deleted so far: ${totalItemsDeleted}`);
    offset += caseUserNotesPageSize;
    caseNotesToDelete = await getCaseNotesToDelete(offset);
  }
  console.log('Done deleting case notes from Dynamo');
}

main().catch(console.error);
