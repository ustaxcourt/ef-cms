#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { ROLES } from '@shared/business/entities/EntityConstants';

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
      default: `${DateTime.now().toObject().year}`,
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

const getDocketNumbersOfCasesFiledInYear = async (): Promise<string[]> => {
  const results = (await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .select('de.docketNumber')
      .where('de.eventCode', '=', 'P')
      .where('de.receivedAt', '>=', begin)
      .where('de.receivedAt', '<', end)
      .orderBy('de.receivedAt', 'asc')
      .execute(),
  )) as { docketNumber: string }[];
  return Array.from(new Set(results.map(p => p.docketNumber)));
};

const countCasesWithRepresentation = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<number> => {
  const results = (await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uc')
      .select('uc.docketNumber')
      .where('uc.actingAsRole', '=', ROLES.privatePractitioner)
      .where('uc.docketNumber', 'in', docketNumbers)
      .execute(),
  )) as { docketNumber: string }[];
  const uniqueDocketNumbers = new Set(results.map(c => c.docketNumber));
  return uniqueDocketNumbers.size;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const docketNumbers = await getDocketNumbersOfCasesFiledInYear();
  const totalCases = docketNumbers.length;
  const numberOfCasesWithRepresentation = await countCasesWithRepresentation({
    docketNumbers,
  });
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
