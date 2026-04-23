#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CLOSED_CASE_STATUSES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';
import { createISODateString } from '@shared/business/utilities/DateHandler';

const scriptConfig: ScriptConfig = {
  description:
    'represented-count-in-all-open-cases - Generates a table comparing ' +
    'counts of represented and pro se across all open cases',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const countOpenCases = async (): Promise<number> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .where('c.status', 'not in', CLOSED_CASE_STATUSES)
      .select(({ ref }) =>
        sql<number>`count(distinct ${ref('c.docketNumber')})`.as('count'),
      )
      .executeTakeFirst(),
  );
  return Number(result?.count) || 0;
};

const countOpenCasesWithRepresentation = async (): Promise<number> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .innerJoin('dwUserOnCase as uc', 'uc.docketNumber', 'c.docketNumber')
      .where('c.status', 'not in', CLOSED_CASE_STATUSES)
      .where('uc.actingAsRole', '=', ROLES.privatePractitioner)
      .select(({ ref }) =>
        sql<number>`count(distinct ${ref('c.docketNumber')})`.as('count'),
      )
      .executeTakeFirst(),
  );

  return Number(result?.count) || 0;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const totalCases = await countOpenCases();
  if (totalCases === 0) {
    console.error('No open cases found');
    process.exit(1);
  }
  const numberOfCasesWithRepresentation =
    await countOpenCasesWithRepresentation();
  const numberOfProSeCases = totalCases - numberOfCasesWithRepresentation;
  const today = createISODateString().split('T')[0];
  console.log(`All Open Cases as of ${today}`);
  console.table([
    {
      Type: 'Represented',
      Cases: numberOfCasesWithRepresentation,
      Percent: Math.round((numberOfCasesWithRepresentation / totalCases) * 100),
    },
    {
      Type: 'Pro Se',
      Cases: numberOfProSeCases,
      Percent: Math.round((numberOfProSeCases / totalCases) * 100),
    },
  ]);
})();
