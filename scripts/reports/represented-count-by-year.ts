#!/usr/bin/env -S npx ts-node --transpile-only

import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getNowObject } from '@shared/business/utilities/DateHandler';
import { sql } from 'kysely';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'represented-count-by-year - Generates a table comparing counts of ' +
    'represented and pro se cases in a given calendar or fiscal year',
  environment: {
    env: 'ENV',
  },
  parameters: {
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    year: {
      default: `${thisYear}`,
      position: 0,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { fiscal, year } = parseArgsAndEnvVars(scriptConfig) as {
  fiscal: boolean;
  year: string;
};
const { begin, end } = getJsTimeframeForYear({ fiscal, year });

const countCasesFiledInYear = async (): Promise<number> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .where('de.eventCode', '=', 'P')
      .where('de.filingDate', '>=', begin)
      .where('de.filingDate', '<', end)
      .select(({ ref }) =>
        sql<number>`count(distinct ${ref('de.docketNumber')})`.as('count'),
      )
      .executeTakeFirst(),
  );
  return Number(result?.count) || 0;
};

const countCasesWithRepresentation = async (): Promise<number> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .innerJoin('dwUserOnCase as uc', 'uc.docketNumber', 'de.docketNumber')
      .where('de.eventCode', '=', 'P')
      .where('de.filingDate', '>=', begin)
      .where('de.filingDate', '<', end)
      .where('uc.actingAsRole', '=', ROLES.privatePractitioner)
      .select(({ ref }) =>
        sql<number>`count(distinct ${ref('de.docketNumber')})`.as('count'),
      )
      .executeTakeFirst(),
  );

  return Number(result?.count) || 0;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const totalCases = await countCasesFiledInYear();
  if (totalCases === 0) {
    console.error(`No cases filed in ${fiscal ? 'FY ' : ''}${year}`);
    process.exit(1);
  }
  const numberOfCasesWithRepresentation = await countCasesWithRepresentation();
  const numberOfProSeCases = totalCases - numberOfCasesWithRepresentation;
  console.log(`${fiscal ? 'Fiscal' : 'Calendar'} Year ${year}`);
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
