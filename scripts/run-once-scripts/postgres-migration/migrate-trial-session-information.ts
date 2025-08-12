#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import {
  toKyselyNewTrialSession,
  toKyselyNewTrialSessionCase,
} from '@web-api/persistence/postgres/trialSessions/mapper';
import { getConnection } from '@web-api/getConnection';
import { settlePromises } from '@web-api/utilities/settlePromises';

const scriptConfig: ScriptConfig = {
  description: 'Move trial session information from dynamo to postgres ',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const totalSegments = 10;
let itemsScanned = 0;

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
  console.log('Finished moving trial sessions from dynamo to postgres');
}

async function createTrialSessionRecords(trialSessions) {
  await getConnection({
    cb: db =>
      db
        .insertInto('dwTrialSession')
        .values(
          trialSessions.map(ts => {
            toKyselyNewTrialSession(ts);
          }),
        )
        .execute(),
  });
}

async function createPaperPdfRecords(trialSessionPaperPdfs) {
  await getConnection({
    cb: db =>
      db
        .insertInto('dwTrialSessionPaperPdf')
        .values(trialSessionPaperPdfs)
        .execute(),
  });
}

async function createTrialSessionWorkingCopies(trialSessionWorkingCopies) {
  await getConnection({
    cb: db =>
      db
        .insertInto('dwTrialSessionWorkingCopy')
        .values(trialSessionWorkingCopies)
        .execute(),
  });
}

async function createCaseTrialSessionFromOrder(caseOrders) {
  // todo onconflict!!! We don't want to update isHearing if the record already exists
  await getConnection({
    cb: db =>
      db
        .insertInto('dwTrialSessionCase')
        .values(
          caseOrders.map(co => {
            toKyselyNewTrialSessionCase({ ...co, isHearing: false });
          }),
        )
        .execute(),
  });
}

async function scanContinuously(params: ScanCommandInput) {
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const trialSessions: RawTrialSession[] = [];
    const trialSessionWorkingCopies: RawTrialSessionWorkingCopy[] = [];
    const caseOrders: any = [];
    const caseHearings: any = [];
    const trialSessionPaperPdfs: any[] = [];

    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (record.pk.startsWith('trial-session|')) {
        if (record.sk.startsWith('trial-session|')) {
          trialSessions.push(record as unknown as RawTrialSession);
          if (record.caseOrder) {
            caseOrders.push(
              ...record.caseOrder.map(co => ({
                ...co,
                trialSessionId: record.trialSessionId,
              })),
            );
          }
        }
        if (record.sk.startsWith('paper-service-pdf|')) {
          trialSessionPaperPdfs.push({
            ...record,
            trialSessionId: record.pk.substring(14),
          });
        }
      }
      if (record.pk.startsWith('trial-session-working-copy')) {
        trialSessionWorkingCopies.push(
          record as unknown as RawTrialSessionWorkingCopy,
        );
      }
      if (record.pk.startsWith('case|') && record.sk.startsWith('hearing|')) {
        caseHearings.push(record);
      }
    }

    await settlePromises([
      createTrialSessionRecords(trialSessions),
      createPaperPdfRecords(trialSessionPaperPdfs),
      createTrialSessionWorkingCopies(trialSessionWorkingCopies),
      createCaseTrialSessionFromOrder(caseOrders),
    ]);

    itemsScanned += items.length;
    console.log(`itemsScanned: ${itemsScanned}`);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

void main();
