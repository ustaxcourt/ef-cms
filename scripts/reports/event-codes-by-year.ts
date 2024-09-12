#!/usr/bin/env npx ts-node --transpile-only

// usage: scripts/reports/event-codes-by-year.ts M071,M074 [-y 2021-2022] > ~/Desktop/m071s-and-m074s-filed-2021-2022.csv

import { DateTime } from 'luxon';
import { createApplicationContext } from '@web-api/applicationContext';
import { parseArgs } from 'node:util';
import { parseIntsArg } from './reportUtils';
import { requireEnvVars } from '../../shared/admin-tools/util';
import {
  search,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

requireEnvVars(['ENV', 'REGION']);
let positionals, values;

const config = {
  allowPositionals: true,
  options: {
    years: {
      default: `${DateTime.now().toObject().year}`,
      short: 'y',
      type: 'string',
    },
  },
  strict: true,
} as const;

function usage(warning: string | undefined) {
  if (warning) {
    console.log(warning);
  }
  console.log(`Usage: ${process.argv[1]} M071,m074 [-y 2023,2024]`);
  console.log('Options:', JSON.stringify(config, null, 4));
}

const cachedCases: { [key: string]: RawCase } = {};

const getCase = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
}): Promise<RawCase | undefined> => {
  if (docketNumber in cachedCases) {
    return cachedCases[docketNumber];
  }
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: {
              term: {
                'docketNumber.S': docketNumber,
              },
            },
          },
        },
        size: 1,
      },
      index: 'efcms-case',
    },
  });
  if (!results) {
    return;
  }
  cachedCases[docketNumber] = results[0];
  return cachedCases[docketNumber];
};

const getDocketEntriesByEventCodesAndYears = async ({
  applicationContext,
  eventCodes,
  years,
}: {
  applicationContext: IApplicationContext;
  eventCodes: string[];
  years?: number[];
}): Promise<RawDocketEntry[]> => {
  const must: {}[] = [
    {
      bool: {
        should: eventCodes.map(eventCode => {
          return {
            term: {
              'eventCode.S': eventCode,
            },
          };
        }),
      },
    },
  ];
  if (years && years.length) {
    if (years.length === 1) {
      must.push({
        range: {
          'receivedAt.S': {
            gte: validateDateAndCreateISO({
              day: '1',
              month: '1',
              year: String(years[0]),
            }),
            lt: validateDateAndCreateISO({
              day: '1',
              month: '1',
              year: String(years[0] + 1),
            }),
          },
        },
      });
    } else {
      must.push({
        bool: {
          should: years.map(year => {
            return {
              range: {
                'receivedAt.S': {
                  gte: validateDateAndCreateISO({
                    day: '1',
                    month: '1',
                    year: String(year),
                  }),
                  lt: validateDateAndCreateISO({
                    day: '1',
                    month: '1',
                    year: String(year + 1),
                  }),
                },
              },
            };
          }),
        },
      });
    }
  }
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must,
          },
        },
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    ({ positionals, values } = parseArgs(config));
  } catch (ex) {
    usage(`Error: ${ex}`);
    process.exit(1);
  }
  if (positionals.length === 0) {
    usage('invalid input: expected event codes');
    process.exit(1);
  }
  const eventCodes = positionals[0].split(',').map(s => s.toUpperCase());
  const years: number[] = parseIntsArg(values.years);
  const applicationContext = createApplicationContext({});

  const docketEntries = await getDocketEntriesByEventCodesAndYears({
    applicationContext,
    eventCodes,
    years,
  });

  console.log(
    '"Docket Number","Date Filed","Document Type","Associated Judge",' +
      '"Case Status","Case Caption"',
  );
  for (const de of docketEntries) {
    if (!('docketNumber' in de)) {
      continue;
    }
    const c = await getCase({
      applicationContext,
      docketNumber: de.docketNumber,
    });
    if (!c) {
      continue;
    }
    const associatedJudge = c.associatedJudge
      ?.replace('Chief Special Trial ', '')
      .replace('Special Trial ', '')
      .replace('Judge ', '');
    console.log(
      `"${c.docketNumberWithSuffix}","${de.receivedAt.split('T')[0]}",` +
        `"${de.documentType}","${associatedJudge}","${c.status}",` +
        `"${c.caseCaption}"`,
    );
  }
})();
