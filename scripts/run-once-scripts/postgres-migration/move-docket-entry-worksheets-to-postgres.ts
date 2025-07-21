#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { writeFileSync } from 'fs';
import { upsertDocketEntryWorksheets } from '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets';
import { parseArgsAndEnvVars, ScriptConfig } from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description: 'Move docket entry workhseets from dynamo to postgres ',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;
const docketEntryWorksheets: RawDocketEntryWorksheet[] = [];

async function main() {
  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      scanContinuously({
        TableName: environment.dynamoDbTableName,
        Segment: segment,
        TotalSegments: totalSegments,
      }),
    ),
  );
  console.log(
    'Finished table scan. Writing docket entry worksheets to allDocketEntryWorksheets.json',
  );
  writeFileSync(
    'allDocketEntryWorksheets.json',
    JSON.stringify(docketEntryWorksheets),
  );
  console.log('Going to upsertDocketEntries');
  await upsertDocketEntryWorksheets({ docketEntryWorksheets });
}

async function scanContinuously(params: ScanCommandInput) {
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (record.sk.startsWith('docket-entry-worksheet|')) {
        docketEntryWorksheets.push(record as unknown as DocketEntryWorksheet);
      }
    }

    itemsScanned += items.length;
    console.log(
      `itemsScanned: ${itemsScanned}, docketEntryWorksheets: ${docketEntryWorksheets.length}`,
    );

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}
process.on('SIGINT', () => {
  process.exit(1);
});

void main();
