#!/usr/bin/env -S npx ts-node --transpile-only


import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewPractitionerDocument } from '@web-api/persistence/postgres/practitionerDocuments/mapper';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;

async function main() {
  await Promise.all(
    Array.from({ length: 10 }).map((_, segment) =>
      scanContinuously({
        params: {
          TableName: environment.dynamoDbTableName,
          Segment: segment,
          TotalSegments: totalSegments,
        },
      }),
    ),
  );
}

async function scanContinuously({ params }: { params: ScanCommandInput }) {
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (
        record.pk.startsWith('practitioner|') &&
        record.sk.startsWith('document|')
      ) {
        const jsonData = JSON.stringify(record);
        console.log('json = ', jsonData);

        const barNumber = record.pk.split('|')[1].toUpperCase();
        const practitionerDocument = {
          practitionerDocumentFileId: record.practitionerDocumentFileId,
          fileName: record.fileName,
          barNumber,
          categoryName: record.categoryName,
          categoryType: record.categoryType,
          description: record.description,
          uploadDate: record.uploadDate,
          location: record.location,
        };
        try {
          await pgInsertInto({
            table: 'dwPractitionerDocuments',
            values: toKyselyNewPractitionerDocument(
              practitionerDocument,
              barNumber,
            ),
            onConflictColumns: ['practitionerDocumentFileId'],
          });
        } catch (err) {
          console.error(
            'Failed to insert:',
            record.practitionerDocumentFileId,
            err,
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
