#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { isEmpty } from 'lodash';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { batchDeleteDynamoItems } from 'scripts/run-once-scripts/postgres-migration/batch-delete-dynamo-items';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Agent } from 'https';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const scriptConfig: ScriptConfig = {
  description:
    'delete-all-docket-entries - Delete from dynamodb docket entries ' +
    'that have been migrated to postgres',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  parameters: {
    startDate: {
      position: 0,
      required: true,
      type: 'string',
    },
    endDate: {
      position: 1,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { sourceTable, startDate, endDate } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  env: string;
  sourceTable: string;
  startDate: string;
  endDate: string;
};
const PAGE_SIZE = 2000;
const dynamoDbClient = new DynamoDBClient({
  maxAttempts: 5,
  region: 'us-east-1',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 5000,
  }),
});
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItems = 0;

/*
This script is only meant to be kicked off by delete-docket-entries.ts. It paginates over a partition
of docket entries in a date range to index them.
*/
async function main() {
  let currentStartDate = calculateDate({ dateString: startDate });
  let docketEntriesToDelete = await getDocketEntriesToDelete(currentStartDate);

  while (!isEmpty(docketEntriesToDelete)) {
    const dynamoItemsToDelete = docketEntriesToDelete.map(cd => ({
      DeleteRequest: {
        Key: {
          pk: `case|${cd.docketNumber}`,
          sk: `docket-entry|${cd.docketEntryId}`,
        },
      },
    }));
    totalItems += await batchDeleteDynamoItems(
      dynamoItemsToDelete,
      dynamoDbDocClient,
      sourceTable,
    );
    console.log(
      `Total docket entries deleted for date range ${startDate} to ${endDate} so far: ${totalItems}`,
    );
    const lastSeenDate =
      docketEntriesToDelete[docketEntriesToDelete.length - 1].createdAt;
    currentStartDate = lastSeenDate;
    docketEntriesToDelete = await getDocketEntriesToDelete(currentStartDate);
  }
  console.log(
    `Done deleting docket entries for for date range ${startDate} to ${endDate}`,
  );
}

const getDocketEntriesToDelete = async (startDate: Date) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .select(['docketEntryId', 'docketNumber', 'createdAt'])
      .orderBy('createdAt')
      .orderBy('docketNumber')
      .orderBy('docketEntryId')
      .where('createdAt', '>', startDate)
      .where('createdAt', '<=', calculateDate({ dateString: endDate }))
      .limit(PAGE_SIZE)
      .execute(),
  );
};

main().catch(console.error);
