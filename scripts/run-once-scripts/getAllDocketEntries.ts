#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { createWriteStream, WriteStream } from 'fs';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;

async function main() {
  const stream = createWriteStream('allTestDocketEntries.txt', { flags: 'w' });

  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      scanContinuously(
        {
          TableName: environment.dynamoDbTableName,
          Segment: segment,
          TotalSegments: totalSegments,
        },
        stream,
      ),
    ),
  );

  stream.end();
}

async function scanContinuously(
  params: ScanCommandInput,
  fileStream: WriteStream,
) {
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (record.sk.startsWith('docket-entry|')) {
        const json = JSON.stringify(record);
        fileStream.write(json);
        fileStream.write('\n');
        if (!fileStream.write('')) {
          await new Promise(resolve => fileStream.once('drain', resolve));
        }
      }
    }

    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

main().catch(console.error);
