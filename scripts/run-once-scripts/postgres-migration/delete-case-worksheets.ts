#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '../../../web-api/src/environment';
import { getDbReader } from '../../../web-api/src/database';
import { isEmpty } from 'lodash';

const caseWorksheetPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getCaseWorksheetsToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCaseWorksheet')
      .select(['docketNumber'])
      .orderBy('docketNumber')
      .limit(caseWorksheetPageSize)
      .offset(offset)
      .execute(),
  );
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
      environment.dynamoDbTableName,
    );
    console.log(`Total case worksheets deleted so far: ${totalItemsDeleted}`);
    offset += caseWorksheetPageSize;
    caseWorksheetsToDelete = await getCaseWorksheetsToDelete(offset);
  }
  console.log('Done deleting case worksheets from Dynamo');
}

main().catch(console.error);
