#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';

const scriptConfig: ScriptConfig = {
  description:
    'petition-counts - Generates a table of petition counts in each month of the given year',
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

const getAllPetitions = async (): Promise<RawDocketEntry[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwDocketEntry as de')
        .selectAll('de')
        .where('de.eventCode', '=', 'P')
        .where('de.receivedAt', '>=', begin)
        .where('de.receivedAt', '<', end)
        .orderBy('de.receivedAt', 'asc')
        .execute(),
    )
  ).map(fromKyselyDocketEntry) as RawDocketEntry[];
};

const getCounts = ({
  gte,
  lt,
  petitions,
}: {
  gte: string;
  lt: string;
  petitions: RawDocketEntry[];
}): { isElectronic: number; isPaper: number } => {
  const petitionsReceivedInTimeframe = petitions.filter(
    p =>
      dateStringsCompared(p.receivedAt, gte) >= 0 &&
      dateStringsCompared(p.receivedAt, lt) < 0,
  );
  return {
    isElectronic: petitionsReceivedInTimeframe.filter(
      p => !('isPaper' in p) || !p.isPaper,
    ).length,
    isPaper: petitionsReceivedInTimeframe.filter(
      p => 'isPaper' in p && p.isPaper,
    ).length,
  };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const petitions = await getAllPetitions();
  const start = DateTime.fromJSDate(begin);

  for (let month = 0; month < 12; month++) {
    const [gte, lt] = [
      start.plus({ months: month }),
      start.plus({ months: month + 1 }),
    ];
    const { isElectronic, isPaper } = getCounts({
      gte: gte.toISO()!,
      lt: lt.toISO()!,
      petitions,
    });
    console.log(
      [
        gte.toLocaleString(),
        isElectronic,
        isPaper,
        isElectronic + isPaper,
      ].join(','),
    );
  }
})();
