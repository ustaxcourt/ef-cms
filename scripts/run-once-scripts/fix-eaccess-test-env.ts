#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import fs from 'fs';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 15;
let itemsScanned = 0;

const setHasEAccessToTrue: { docketNumber: string; contactId: string }[] = [];
const hasConsentedToElectronicService: {
  docketNumber: string;
  contactId: string;
}[] = [];

async function main() {
  await Promise.all(
    Array.from({ length: totalSegments }).map((_, segment) =>
      scanContinuously({
        TableName: environment.dynamoDbTableName,
        Segment: segment,
        TotalSegments: totalSegments,
      }),
    ),
  );

  fs.writeFileSync('./hasEAccess.json', JSON.stringify(setHasEAccessToTrue));
  fs.writeFileSync(
    './hasConsentedToElectronicService.json',
    JSON.stringify(hasConsentedToElectronicService),
  );

  await updateHasEaccessInPostgres();
  await updateHasConsentedToEServicePostgres();
}

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

async function scanContinuously(params: ScanCommandInput) {
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (isCaseRecord(record)) {
        record.petitioners?.forEach(petitioner => {
          if (petitioner.hasEAccess) {
            setHasEAccessToTrue.push({
              contactId: petitioner.contactId,
              docketNumber: record.docketNumber,
            });
          }
          if (petitioner.hasConsentedToEService) {
            hasConsentedToElectronicService.push({
              contactId: petitioner.contactId,
              docketNumber: record.docketNumber,
            });
          }
          if (petitioner.sealedAndUnavailable) {
            console.log('petitioner with sealedAndUnavailable', petitioner);
          }
        });
      }
    }

    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

async function updateHasEaccessInPostgres(): Promise<void> {
  await pgUpdateTable({
    table: 'dwPetitionerOnCase',
    values: { hasElectronicAccess: true },
    where: db =>
      db
        .where(
          'contactId',
          'in',
          setHasEAccessToTrue.map(c => c.contactId),
        )
        .where(
          'docketNumber',
          'in',
          setHasEAccessToTrue.map(c => c.docketNumber),
        ),
  });
}

async function updateHasConsentedToEServicePostgres(): Promise<void> {
  await pgUpdateTable({
    table: 'dwPetitionerOnCase',
    values: { hasConsentedToElectronicService: true },
    where: db =>
      db
        .where(
          'contactId',
          'in',
          hasConsentedToElectronicService.map(c => c.contactId),
        )
        .where(
          'docketNumber',
          'in',
          hasConsentedToElectronicService.map(c => c.docketNumber),
        ),
  });
}

main().catch(console.error);
