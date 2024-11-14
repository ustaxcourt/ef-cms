/**
 * HOW TO RUN
 *
 * TABLE_NAME=testing npx ts-node --transpileOnly scripts/run-once-scripts/postgres-migration/delete-case-worksheets.ts
 */

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from '../../../shared/admin-tools/util';
import { getDbReader } from '../../../web-api/src/database';
import { isEmpty } from 'lodash';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';

const caseWorksheetPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

requireEnvVars(['TABLE_NAME']);

const tableNameInput = process.env.TABLE_NAME!;

const getCaseWorksheetsToDelete = async (offset: number) => {
  const caseWorksheets = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseWorksheet')
      .select(['docketNumber'])
      .orderBy('docketNumber')
      .limit(caseWorksheetPageSize)
      .offset(offset)
      .execute(),
  );
  return caseWorksheets;
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let caseWorksheetsToDelete = await getCaseWorksheetsToDelete(offset);

  while (!isEmpty(caseWorksheetsToDelete)) {
    const dynamoItemsToDelete = caseWorksheetsToDelete.map(cd => ({
      DeleteRequest: {
        Key: {
          pk: `case|${cd.docketNumber}`,
          sk: `case-worksheet|${cd.docketNumber}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      tableNameInput,
    );
    console.log(`Total case worksheets deleted so far: ${totalItemsDeleted}`);
    offset += caseWorksheetPageSize;
    caseWorksheetsToDelete = await getCaseWorksheetsToDelete(offset);
  }
  console.log('Done deleting case worksheets from Dynamo');
}

main().catch(console.error);
