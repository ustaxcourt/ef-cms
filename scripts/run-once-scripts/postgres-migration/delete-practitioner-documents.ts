#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';

const scriptConfig: ScriptConfig = {
  description:
    'delete-practitioner-documents - Delete from dynamodb practitioner document entities that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const practitionerDocumentPageSize = 10000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment['nodeEnv'] = 'production';

const getPractitionerDocumentsToDelete = async (offset: number) => {
  const caseNotes = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitionerDocuments')
      .select(['barNumber', 'practitionerDocumentFileId'])
      .orderBy('barNumber')
      .orderBy('practitionerDocumentFileId')
      .limit(practitionerDocumentPageSize)
      .offset(offset)

      .execute(),
  );
  return caseNotes;
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let practitionerDocumentsToDelete =
    await getPractitionerDocumentsToDelete(offset);

  while (!isEmpty(practitionerDocumentsToDelete)) {
    const dynamoItemsToDelete = practitionerDocumentsToDelete.map(c => ({
      DeleteRequest: {
        Key: {
          pk: `practitioner|${c.barNumber.toLowerCase()}`,
          sk: `document|${c.practitionerDocumentFileId}`,
        },
      },
    }));
    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    console.log(
      `Total practitioner documents deleted so far: ${totalItemsDeleted}`,
    );
    offset += practitionerDocumentPageSize;
    practitionerDocumentsToDelete =
      await getPractitionerDocumentsToDelete(offset);
  }
  console.log('Done deleting practitioner documents from Dynamo');
}

main().catch(console.error);
