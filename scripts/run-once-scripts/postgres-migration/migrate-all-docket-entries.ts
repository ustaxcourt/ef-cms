#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;

async function main() {
  await Promise.all(
    Array.from({ length: totalSegments }).map((_, segment) =>
      scanDynamoAndBatchUpsertDocketEntriesToPostgres({
        TableName: environment.dynamoDbTableName,
        Segment: segment,
        TotalSegments: totalSegments,
      }),
    ),
  );
}

async function scanDynamoAndBatchUpsertDocketEntriesToPostgres(
  params: ScanCommandInput,
) {
  let docketEntries: RawDocketEntry[] = [];
  const BATCH_SIZE = 100;
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (record.sk.startsWith('docket-entry|')) {
        docketEntries.push(record as unknown as RawDocketEntry);
      }
    }

    if (docketEntries.length >= BATCH_SIZE) {
      console.log(
        `Migrating ${BATCH_SIZE} DocketEntry records for scan segment ${params.Segment!}`,
      );
      await upsertDocketEntries(docketEntries);
      docketEntries = [];
      console.log(
        `Successfully migrated ${BATCH_SIZE} DocketEntry records for scan segment ${params.Segment!}`,
      );
    }
    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

main().catch(console.error);
