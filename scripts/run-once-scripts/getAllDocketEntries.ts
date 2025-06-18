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
  const docketEntryStream = createWriteStream('allTestDocketEntries.txt', {
    flags: 'w',
  });
  const usersStream = createWriteStream('users.txt', { flags: 'w' });

  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      scanContinuously({
        params: {
          TableName: environment.dynamoDbTableName,
          Segment: segment,
          TotalSegments: totalSegments,
        },
        docketEntryStream,
        usersStream,
      }),
    ),
  );

  docketEntryStream.end();
  usersStream.end();
}

async function scanContinuously({
  params,
  docketEntryStream,
  usersStream,
}: {
  params: ScanCommandInput;
  docketEntryStream: WriteStream;
  usersStream: WriteStream;
}) {
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
        docketEntryStream.write(json);
        docketEntryStream.write('\n');
        if (!docketEntryStream.write('')) {
          await new Promise(resolve =>
            docketEntryStream.once('drain', resolve as any),
          );
        }
      }

      if (record.pk.startsWith('user|') && record.sk.startsWith('user|')) {
        const json = JSON.stringify(record);
        usersStream.write(json);
        usersStream.write('\n');
        if (!usersStream.write('')) {
          await new Promise(resolve =>
            usersStream.once('drain', resolve as any),
          );
        }
      }

      if (
        record.pk.startsWith('case|') &&
        record.sk.startsWith('irsPractitioner|')
      ) {
        const json = JSON.stringify(record);
        usersStream.write(json);
        usersStream.write('\n');
        if (!usersStream.write('')) {
          await new Promise(resolve =>
            usersStream.once('drain', resolve as any),
          );
        }
      }

      if (
        record.pk.startsWith('case|') &&
        record.sk.startsWith('privatePractitioner|')
      ) {
        const json = JSON.stringify(record);
        usersStream.write(json);
        usersStream.write('\n');
        if (!usersStream.write('')) {
          await new Promise(resolve =>
            usersStream.once('drain', resolve as any),
          );
        }
      }
    }

    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

main().catch(console.error);
