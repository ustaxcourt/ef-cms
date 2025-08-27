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
    'delete-docket-entry-worksheets - Delete from dynamodb docket-entry-worksheet entities ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const pageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

const getDocketEntryWorksheetsToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntryWorksheet')
      .select('docketEntryId')
      .orderBy('docketEntryId')
      .limit(pageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let docketEntryWorksheetsToDelete =
    await getDocketEntryWorksheetsToDelete(offset);

  while (!isEmpty(docketEntryWorksheetsToDelete)) {
    const dynamoItemsToDelete = docketEntryWorksheetsToDelete.map(
      worksheet => ({
        DeleteRequest: {
          Key: {
            pk: `docket-entry|${worksheet.docketEntryId}`,
            sk: `docket-entry-worksheet|${worksheet.docketEntryId}`,
          },
        },
      }),
    );
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(
      `Total docket entry worksheets deleted so far: ${totalItemsDeleted}`,
    );
    offset += pageSize;
    docketEntryWorksheetsToDelete =
      await getDocketEntryWorksheetsToDelete(offset);
  }
  console.log('Done deleting docket entry worksheets from Dynamo');
}

main().catch(console.error);
