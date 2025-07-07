#!/usr/bin/env -S npx ts-node --transpile-only

import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { RawUser } from '@shared/business/entities/User';
import { ROLES } from '@shared/business/entities/EntityConstants';
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

const pageSize = 2000; // Arbitrary, but seemed reasonably performant

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

let totalItems = 0;

async function main() {
  let offset = 0;
  let casesToIndex = await getCasesToMovePetitioners(offset);

  while (!isEmpty(casesToIndex)) {
    for (let index = 0; index < casesToIndex.length; index++) {
      const aCase = casesToIndex[index];
      const petitionerThings: (RawUser & { docketNumber: string })[] =
        aCase.petitioners.map(petitioner => ({
          ...petitioner,
          userId: petitioner.contactId,
          role: ROLES.petitioner,
          docketNumber: aCase.docketNumber,
        }));
      await upsertUsers(petitionerThings);
      await associateUsersWithCases(petitionerThings);
    }

    totalItems += casesToIndex.length;
    console.log(`Total cases index so far: ${totalItems}`);
    offset += pageSize;
    casesToIndex = await getCasesToMovePetitioners(offset);
  }
  console.log('Done indexing cases');
}

main().catch(console.error);
