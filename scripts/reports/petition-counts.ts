#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { applicationContext } from '@web-api/applicationContext';
import {
  dateStringsCompared,
  validateDateAndCreateISO,
} from '@shared/business/utilities/DateHandler';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const scriptConfig: ScriptConfig = {
  description:
    'petition-counts - Generates a table of petition counts in each month of the given year',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
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

const getAllPetitions = async (): Promise<RawDocketEntry[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  'eventCode.S': 'P',
                },
              },
              {
                range: {
                  'receivedAt.S': {
                    gte: validateDateAndCreateISO({
                      day: '1',
                      month: fiscal ? '10' : '1',
                      year: fiscal ? `${Number(year) - 1}` : year,
                    }),
                    lt: validateDateAndCreateISO({
                      day: '1',
                      month: fiscal ? '10' : '1',
                      year: fiscal ? year : `${Number(year) + 1}`,
                    }),
                  },
                },
              },
            ],
          },
        },
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
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
  const start = DateTime.fromISO(
    validateDateAndCreateISO({
      day: '1',
      month: fiscal ? '10' : '1',
      year: fiscal ? `${Number(year) - 1}` : year,
    })!,
  );

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
