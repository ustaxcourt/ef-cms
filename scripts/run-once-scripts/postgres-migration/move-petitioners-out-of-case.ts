#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader, getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';
import { RawUser } from '@shared/business/entities/User';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { toKyselyNewUser } from '@web-api/persistence/postgres/users/mapper';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { associateUsersWithCases } from '@web-api/persistence/postgres/cases/userOnCase/associateUsersWithCases';

const scriptConfig: ScriptConfig = {
  description:
    'move-petitioners-out-of-case - Moves the petitioners array into a separate table',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const pageSize = 500;

const getCasesToMovePetitioners = async (offset: number) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .select(['docketNumber', 'petitioners'])
      .orderBy('docketNumber')
      .limit(pageSize)
      .offset(offset)
      .execute(),
  );
};

const upsertUsers = async (
  users: (RawUser | RawPractitioner | RawIrsPractitioner)[],
): Promise<void> => {
  const dbUsers = users.map(user => toKyselyNewUser(user));

  // Bypassing upsertUsers + pgInsertInto as there will be duplicate information in petitioners.
  // When we upsert there will be duplicate petitioners with the same contactId in the same insert statement.
  // This onConflict doNothing() will pick the first value if there are duplicate userIds
  await getDbWriter({
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
    cb: db =>
      db
        .insertInto('dwUser')
        .values(dbUsers)
        .onConflict(oc => oc.columns(['userId']).doNothing())
        .returningAll()
        .execute(),
    table: 'dwUser',
  });
};

let totalItems = 0;

async function main() {
  let offset = 0;
  let casesToIndex = await getCasesToMovePetitioners(offset);

  while (!isEmpty(casesToIndex)) {
    const petitionersToUpsert: (RawUser & { docketNumber: string })[] = [];

    casesToIndex.forEach(aCase => {
      aCase.petitioners?.forEach(petitioner => {
        const petitionerToUpsert = {
          ...petitioner,
          userId: petitioner.contactId,
          role: ROLES.petitioner,
          docketNumber: aCase.docketNumber,
        };
        petitionersToUpsert.push(petitionerToUpsert);
      });
    });
    await upsertUsers(petitionersToUpsert);
    await associateUsersWithCases(petitionersToUpsert);

    totalItems += casesToIndex.length;
    console.log(`Total cases index so far: ${totalItems}`);
    offset += pageSize;
    casesToIndex = await getCasesToMovePetitioners(offset);
  }
  console.log('Done indexing cases');
}

main().catch(console.error);
