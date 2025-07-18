#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { RawUser } from '@shared/business/entities/User';
import { Role, ROLES } from '@shared/business/entities/EntityConstants';
import { getConnection } from '@web-api/getConnection';
import { toKyselyNewUserOnCase } from '@web-api/persistence/postgres/cases/userOnCase/mapper';
import { UserOnCaseAssociation } from '@web-api/persistence/postgres/cases/userOnCase/schema';

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

const associateUsersWithCases = async (
  userOnCaseRecords: Array<UserOnCaseAssociation>,
) => {
  if (!userOnCaseRecords.length) {
    return;
  }
  const dbUserOnCases = userOnCaseRecords.map(toKyselyNewUserOnCase);

  // We are specifically not using pgInsertInto because we do not want to trigger openSearch. We do not want to trigger openSearch because not all users have been moved yet.
  await getConnection({
    cb: db =>
      db
        .insertInto('dwUserOnCase')
        .values(dbUserOnCases)
        .onConflict(oc =>
          oc.columns(['userId', 'docketNumber']).doUpdateSet(eb => ({
            representing: eb.ref('excluded.representing'),
            serviceIndicator: eb.ref('excluded.serviceIndicator'),
            actingAsRole: eb.ref('excluded.actingAsRole'),
          })),
        )
        .returningAll()
        .execute(),
  });
};

let totalItems = 0;

async function main() {
  let offset = 0;
  let casesToIndex = await getCasesToMovePetitioners(offset);

  while (!isEmpty(casesToIndex)) {
    const petitionersToUpsert: (RawUser & {
      docketNumber: string;
      actingAsRole: Role;
    })[] = [];

    casesToIndex.forEach(aCase => {
      aCase.petitioners?.forEach(petitioner => {
        const petitionerToUpsert = {
          ...petitioner,
          userId: petitioner.contactId,
          role: ROLES.petitioner,
          docketNumber: aCase.docketNumber,
          actingAsRole: ROLES.petitioner,
        };
        petitionersToUpsert.push(petitionerToUpsert);
      });
    });
    await associateUsersWithCases(petitionersToUpsert);

    totalItems += casesToIndex.length;
    console.log(`Total cases index so far: ${totalItems}`);
    offset += pageSize;
    casesToIndex = await getCasesToMovePetitioners(offset);
  }
  console.log('Done indexing cases');
}

main().catch(console.error);
