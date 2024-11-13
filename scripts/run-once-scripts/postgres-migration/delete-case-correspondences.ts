/**
 * HOW TO RUN
 *
 * TABLE_NAME=testing npx ts-node --transpileOnly scripts/postgres/delete-case-correspondences.ts
 */

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from '../../../shared/admin-tools/util';
import { getDbReader } from '../../../web-api/src/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';

const caseCorrespondencePageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

requireEnvVars(['TABLE_NAME']);

const tableNameInput = process.env.TABLE_NAME!;

const getCaseCorrespondencesToDelete = async (offset: number) => {
  const caseCorrespondences = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseCorrespondence')
      .select(['docketNumber', 'correspondenceId'])
      .orderBy('correspondenceId')
      .limit(caseCorrespondencePageSize)
      .offset(offset)
      .execute(),
  );
  return caseCorrespondences;
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let caseCorrespondencesToDelete =
    await getCaseCorrespondencesToDelete(offset);

  while (!isEmpty(caseCorrespondencesToDelete)) {
    const dynamoItemsToDelete = caseCorrespondencesToDelete.map(cd => ({
      DeleteRequest: {
        Key: {
          pk: `case|${cd.docketNumber}`,
          sk: `correspondence${cd.correspondenceId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      tableNameInput,
    );
    console.log(
      `Total case correspondences deleted so far: ${totalItemsDeleted}`,
    );
    offset += caseCorrespondencePageSize;
    caseCorrespondencesToDelete = await getCaseCorrespondencesToDelete(offset);
  }
  console.log('Done deleting case correspondences from Dynamo');
}

main().catch(console.error);
