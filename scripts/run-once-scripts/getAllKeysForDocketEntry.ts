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
  const result = await documentClient.scan(params);
  const items = result.Items ?? [];

  items.forEach((record: TDynamoRecord) => {
    if (record.sk.startsWith('docket-entry|')) {
      Object.keys(record).forEach(key => {
        const numberOfOccurences = uniqueKeysMap.get(key) || 0;
        if (numberOfOccurences) {
          uniqueKeysMap.set(key, numberOfOccurences + 1);
        } else {
          uniqueKeysMap.set(key, 1);
        }
      });
    }
  });
  itemsScanned = itemsScanned + items.length;
  console.log('itemsScanned: ', itemsScanned);

  if (result.LastEvaluatedKey) {
    params.ExclusiveStartKey = result.LastEvaluatedKey;
    await scanContinuously(params);
  }
}
process.on('SIGINT', () => {
  console.log(uniqueKeysMap);
  // console.log('records scanned', itemsScanned);
  process.exit(1);
});
main().catch(console.error);
