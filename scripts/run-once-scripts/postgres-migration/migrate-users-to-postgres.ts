#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { environment } from '@web-api/environment';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
// import {
//   DocketEntryWorksheet,
//   RawDocketEntryWorksheet,
// } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
// import { writeFileSync } from 'fs';
// import { upsertDocketEntryWorksheets } from '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';
import { getConnection } from '@web-api/getConnection';
import { toKyselyNewUserOnCase } from '@web-api/persistence/postgres/cases/userOnCase/mapper';
import { toKyselyNewUser } from '@web-api/persistence/postgres/users/mapper';
import { getColumnsForTable } from '@web-api/persistence/postgres/utils/getColumnsForTable';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';
import { associateUsersWithCasesPending } from '@web-api/persistence/postgres/cases/pendingCases/associateUsersWithCasesPending';

const scriptConfig: ScriptConfig = {
  description: 'Move users and case associations from dynamo to postgres ',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

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
        TableName: environment.dynamoDbTableName,
        Segment: segment,
        TotalSegments: totalSegments,
      }),
    ),
  );
  console.log(
    'Finished table scan. Writing docket entry worksheets to allDocketEntryWorksheets.json',
  );
}

async function associateUsersWithCases(
  userOnCaseRecords: Array<{
    userId: string;
    docketNumber: string;
    representing?: string[];
    serviceIndicator?: string;
  }>,
) {
  if (!userOnCaseRecords.length) {
    return;
  }
  const dbUsers = userOnCaseRecords.map(toKyselyNewUserOnCase);

  await getConnection({
    cb: db =>
      db
        .insertInto('dwUserOnCase')
        .values(dbUsers)
        .onConflict(oc =>
          oc.columns(['userId', 'docketNumber']).doUpdateSet(eb => ({
            representing: eb.ref('excluded.representing'),
            serviceIndicator: eb.ref('excluded.serviceIndicator'),
          })),
        )
        .returningAll()
        .execute(),
  });
}

export const upsertUsers = async (
  users: (RawUser | RawPractitioner | RawIrsPractitioner)[],
): Promise<void> => {
  if (!users.length) {
    return;
  }
  const dbUsers = users.map(toKyselyNewUser);

  await getConnection({
    cb: db =>
      db
        .insertInto('dwUser')
        .values(dbUsers)
        .onConflict(oc =>
          oc.columns(['userId']).doUpdateSet(() => {
            return Object.fromEntries(
              getColumnsForTable('dwUser')
                .filter(x => !['userId'].includes(x))
                .map(column => [
                  column,
                  // Needed for excluded.${column} to be dynamically filled in
                  // @ts-ignore
                  c.ref(`excluded.${column}`),
                ]),
            );
          }),
        )
        .returningAll()
        .execute(),
  });
};

async function scanContinuously(params: ScanCommandInput) {
  let lastEvaluatedKey: typeof params.ExclusiveStartKey | undefined = undefined;

  do {
    const irsPractitionerCaseAssociations: Array<{
      userId: string;
      docketNumber: string;
      representing?: string[];
      serviceIndicator?: string;
    }> = []; // {pk: case|, sk: irsPractitioner| }
    const privatePractitionerCaseAssociations: Array<{
      userId: string;
      docketNumber: string;
      representing?: string[];
      serviceIndicator?: string;
    }> = []; // {pk: case|, sk: privatePractitioner| }
    const userRecords = []; // {pk: user|, sk: user| }
    const userOnCasePendingRecords = []; // {pk: case|, sk: pending-case| }
    // const userRecords = [] // {pk: user|, sk: case| } We should not need to process these. For irs/private association is defined through the {pk: case|, sk: privatePractitioner| }. For petitioners it is defined by the dwCase.petitioners array

    const result = await documentClient.scan({
      ...params,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const items = result.Items ?? [];

    for (const record of items as TDynamoRecord[]) {
      if (
        record.pk.startsWith('case|') &&
        record.sk.startsWith('irsPractitioner|')
      ) {
        irsPractitionerCaseAssociations.push({
          docketNumber: record.pk.split('|')[1],
          userId: record.sk.split('|')[1],
          serviceIndicator: record.serviceIndicator,
        });
      }
      if (
        record.pk.startsWith('case|') &&
        record.sk.startsWith('privatePractitioner|')
      ) {
        privatePractitionerCaseAssociations.push({
          docketNumber: record.pk.split('|')[1],
          userId: record.sk.split('|')[1],
          serviceIndicator: record.serviceIndicator,
          representing: record.representing,
        });
      }
      if (record.pk.startsWith('user|') && record.sk.startsWith('user|')) {
        userRecords.push(record);
      }
      if (
        record.pk.startsWith('case|') &&
        record.sk.startsWith('pending-case|')
      ) {
        userOnCasePendingRecords.push(record);
      }
    }

    // This is a chance that a user is associated to a case but does not have a user record
    // is this an issues though?

    await associateUsersWithCases([
      ...irsPractitionerCaseAssociations,
      ...privatePractitionerCaseAssociations,
    ]);
    await upsertUsers(userRecords);
    await associateUsersWithCasesPending(userOnCasePendingRecords);

    itemsScanned += items.length;
    console.log(`itemsScanned: ${itemsScanned}`);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}

void main();
