/**
 * HOW TO RUN
 * npx ts-node --transpileOnly scripts/run-once-scripts/postgres-migration/delete-case-notes.ts
 */

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getDbReader } from '../../../web-api/src/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '../../../web-api/src/environment';

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
