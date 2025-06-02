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
    'delete-practitioners-mapping - Delete from dynamodb practitioner mapping records ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const userOnCasePendingPageSize = 1000;
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

// We set the environment as 'production' (= "a deployed environment") to get the RDS connection to work properly
environment.nodeEnv = 'production';

const getPractitionerMappingRecordsToDelete = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner')
      .select(['userId', 'barNumber', 'name', 'role'])
      .orderBy('userId')
      .limit(userOnCasePendingPageSize)
      .offset(offset)
      .execute(),
  );
};

let totalItemsDeleted = 0;

async function main() {
  let offset = 0;
  let practitionerMappingRecordsToDelete =
    await getPractitionerMappingRecordsToDelete(offset);

  while (!isEmpty(practitionerMappingRecordsToDelete)) {
    const dynamoItemsToDelete: any = [];
    practitionerMappingRecordsToDelete.forEach(r => {
      dynamoItemsToDelete.push({
        DeleteRequest: {
          Key: {
            pk: `${r.role}|${r.name.toLowerCase()}`,
            sk: `user|${r.userId}`,
          },
        },
      });
      dynamoItemsToDelete.push({
        DeleteRequest: {
          Key: {
            pk: `${r.role}|${r.name.toUpperCase()}`,
            sk: `user|${r.userId}`,
          },
        },
      });
      dynamoItemsToDelete.push({
        DeleteRequest: {
          Key: {
            pk: `${r.role}|${r.barNumber}`,
            sk: `user|${r.userId}`,
          },
        },
      });
    });

    totalItemsDeleted += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );

    console.log(
      `Total practitioner mapping records deleted so far: ${totalItemsDeleted}`,
    );
    offset += userOnCasePendingPageSize;
    practitionerMappingRecordsToDelete =
      await getPractitionerMappingRecordsToDelete(offset);
  }
  console.log('Done deleting practitioner mapping records from Dynamo');
}

main().catch(console.error);
