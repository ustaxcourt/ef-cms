#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { RawStatistic } from '@shared/business/entities/Statistic';
import { writeFileSync } from 'fs';
import { getDbReader } from '@web-api/database';
import { CompiledQuery } from 'kysely';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;
const allStatistics: { docketNumber: string; statistics: RawStatistic[] }[] =
  [];

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
  console.log('done scanning dynamo');
  writeFileSync('allStatistics.json', JSON.stringify(allStatistics));
  console.log('done writing file');
  await getDbReader(db =>
    db.executeQuery(
      CompiledQuery.raw(
        `
            INSERT INTO dw_case_clone (docket_number, statistics)
            SELECT elem->>'docketNumber' AS docket_number, elem->'statistics' AS statistics FROM jsonb_array_elements($1::jsonb) AS elem
            ON CONFLICT (docket_number) DO UPDATE
            SET statistics = EXCLUDED.statistics;
            `,
        [JSON.stringify(allStatistics)],
      ),
    ),
  );
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
      if (record.sk.startsWith('case|')) {
        if (record.statistics?.length) {
          allStatistics.push({
            docketNumber: record.docketNumber,
            statistics: record.statistics,
          });
        }
      }
    }

    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

void main();
