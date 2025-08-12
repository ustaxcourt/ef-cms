#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description: 'Testing ',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

function findNonMatching(arr1, arr2): { onlyInArr1; onlyInArr2 } {
  const key = o => `${o.docketNumber}::${o.trialSessionId}`;

  const set2 = new Set(arr2.map(key));
  const set1 = new Set(arr1.map(key));

  const onlyInArr1 = arr1.filter(o => !set2.has(key(o)));
  const onlyInArr2 = arr2.filter(o => !set1.has(key(o)));

  return { onlyInArr1, onlyInArr2 };
}

const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;

const trialSessionCaseOrders: any[] = [];
const caseTrialSessions: any = [];

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
  console.log('trialSessionCaseOrders.length', trialSessionCaseOrders.length);
  console.log('caseTrialSessions.length', caseTrialSessions.length);
  console.log(findNonMatching(trialSessionCaseOrders, caseTrialSessions));
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
      if (record.pk.startsWith('trial-session|')) {
        if (record.sk.startsWith('trial-session|')) {
          if (record.caseOrder) {
            trialSessionCaseOrders.push(
              ...record.caseOrder.map(co => ({
                ...co,
                trialSessionId: record.trialSessionId,
              })),
            );
          }
        }
      }
      if (record.pk.startsWith('case|') && record.sk.startsWith('hearing|')) {
        const caseTrialSession = {
          docketNumber: record.pk.substring(5),
          trialSessionId: record.trialSessionId,
        };
        caseTrialSessions.push(caseTrialSession);
      }
    }

    itemsScanned += items.length;
    console.log(`itemsScanned: ${itemsScanned}`);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

void main();
