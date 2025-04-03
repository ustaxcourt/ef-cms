#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
const uniqueKeysMap: Map<string, number> = new Map();
let itemsScanned = 0;

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

  console.log(uniqueKeysMap);
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
      if (record.sk.startsWith('docket-entry|')) {
        for (const key of Object.keys(record)) {
          const currentCount = uniqueKeysMap.get(key) || 0;
          uniqueKeysMap.set(key, currentCount + 1);
        }
      }
    }

    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}
process.on('SIGINT', () => {
  console.log(uniqueKeysMap);
  process.exit(1);
});
main()
  .then(() => {
    console.log(uniqueKeysMap);
  })
  .catch(console.error);
