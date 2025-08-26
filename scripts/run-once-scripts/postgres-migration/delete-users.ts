#!/usr/bin/env -S npx ts-node --transpile-only
/* eslint-disable complexity */

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { batchDeleteDynamoItems } from 'scripts/run-once-scripts/postgres-migration/batch-delete-dynamo-items';

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;
const deleteRequests: {
  DeleteRequest: {
    Key: {
      pk: string;
      sk: string;
    };
  };
}[] = [];

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

  await batchDeleteDynamoItems(
    deleteRequests,
    documentClient,
    environment.dynamoDbTableName,
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
      const isUserRecord =
        record.pk.startsWith('user|') && record.sk.startsWith('user|');
      const isPrivatePractitionerOnCaseRecord =
        record.pk.startsWith('case|') &&
        record.sk.startsWith('privatePractitioner|');
      const isIrsOnCaseRecord =
        record.pk.startsWith('case|') &&
        record.sk.startsWith('irsPractitioner|');
      const isPendingCaseRecord =
        record.pk.startsWith('user|') && record.sk.startsWith('pending-case|');
      const isUserSectionRecord =
        record.pk.startsWith('section|') && record.sk.startsWith('user|');
      const isConfirmationCode =
        record.pk.startsWith('user|') &&
        record.sk.startsWith('account-confirmation-code');
      const isUserEmail =
        record.pk.startsWith('user-email|') && record.sk.startsWith('user|');
      const isUserCaseAssociation =
        record.pk.startsWith('user|') && record.sk.startsWith('case|');
      const isPrivatePractitionerUserRecord =
        record.pk.startsWith('privatePractitioner|') &&
        record.sk.startsWith('user|');
      const isInactivePractitionerUserRecord =
        record.pk.startsWith('inactivePractitioner|') &&
        record.sk.startsWith('user|');
      const isIrsPractitionerUserRecord =
        record.pk.startsWith('irsPractitioner|') &&
        record.sk.startsWith('user|');
      const isBarNumberCounter = record.pk.startsWith('barNumberCounter');
      const isDocketNumberCounter = record.pk.startsWith('docketNumberCounter');
      const isUserCaseNote =
        record.pk.startsWith('user-case-note') && record.sk.startsWith('user');
      const isDocketEntry =
        record.pk.startsWith('case|') && record.sk.startsWith('docket-entry|');
      const isIpLimiteer = record.pk.startsWith('ip-limiter-document-search');
      const isChangeOfAddressJob = record.pk.startsWith(
        'change-of-address-job',
      );
      const isOpinionSearch = record.pk.startsWith(
        'user-limiter-opinion-search',
      );
      const isOrderSearch = record.pk.startsWith('user-limiter-order-search');

      if (
        isUserRecord ||
        isPrivatePractitionerOnCaseRecord ||
        isIrsOnCaseRecord ||
        isPendingCaseRecord ||
        isUserSectionRecord ||
        isConfirmationCode ||
        isUserEmail ||
        isUserCaseAssociation ||
        isPrivatePractitionerUserRecord ||
        isInactivePractitionerUserRecord ||
        isIrsPractitionerUserRecord ||
        isBarNumberCounter ||
        isDocketNumberCounter ||
        isUserCaseNote ||
        isDocketEntry ||
        isIpLimiteer ||
        isChangeOfAddressJob ||
        isOpinionSearch ||
        isOrderSearch
      ) {
        deleteRequests.push({
          DeleteRequest: { Key: { pk: record.pk, sk: record.sk } },
        });
      }
    }

    itemsScanned += items.length;
    console.log('itemsScanned:', itemsScanned);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

void main();
