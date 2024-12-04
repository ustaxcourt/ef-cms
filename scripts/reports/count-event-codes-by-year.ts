#!/usr/bin/env npx ts-node --transpile-only

// usage examples:
//   scripts/reports/count-event-codes-by-year.ts NOA -f -y 2024
//   scripts/reports/count-event-codes-by-year.ts m01,m02,FEEW -y 2000-2020
//   scripts/reports/count-event-codes-by-year.ts M071,M074 --years 2021,2022,2024

import { DateTime } from 'luxon';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { count } from '@web-api/persistence/elasticsearch/searchClient';
import { parseArgs } from 'node:util';
import { parseIntsArg } from './reportUtils';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

requireEnvVars(['ENV', 'REGION']);

const config = {
  allowPositionals: true,
  options: {
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    help: {
      default: false,
      short: 'h',
      type: 'boolean',
    },
    stricken: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    verbose: {
      default: false,
      short: 'v',
      type: 'boolean',
    },
    years: {
      default: `${DateTime.now().toObject().year}`,
      short: 'y',
      type: 'string',
    },
  },
  strict: true,
} as const;

const usage = (warning?: string): void => {
  if (warning) {
    console.log(warning);
  }
  console.log(`Usage: ${process.argv[1]} M071,m074 [-f -y 2000-2022]`);
  console.log('Options:', JSON.stringify(config, null, 2));
};

const parseArguments = (): {
  eventCodes: string[];
  fiscal: boolean;
  stricken: boolean;
  years: number[];
} => {
  let positionals: string[];
  let values: {
    [k: string]: any;
    fiscal: boolean;
    help: boolean;
    stricken: boolean;
    verbose: boolean;
    years: string;
  };
  try {
    ({ positionals, values } = parseArgs(config));
  } catch (ex) {
    usage(`Error: ${ex}`);
    process.exit(1);
  }
  if (values.verbose) {
    usage('Verbose output enabled');
    console.log('positionals:', positionals);
    console.log('values:', values);
  }
  if (values.help) {
    if (!values.verbose) {
      usage();
    }
    process.exit(0);
  }
  if (!positionals || positionals.length === 0) {
    const errorMessage = 'invalid input: expected event codes';
    if (values.verbose) {
      console.log(errorMessage);
    } else {
      usage(errorMessage);
    }
    process.exit(1);
  }
  return {
    eventCodes: positionals[0].split(',').map(s => s.toUpperCase()),
    fiscal: values.fiscal,
    stricken: values.stricken,
    years: parseIntsArg(values.years),
  };
};

const getCountDocketEntriesByEventCodesAndYears = async ({
  applicationContext,
  eventCodes,
  fiscal,
  onlyNonStricken,
  years,
}: {
  applicationContext: ServerApplicationContext;
  eventCodes: string[];
  fiscal: boolean;
  onlyNonStricken: boolean;
  years?: number[];
}): Promise<number> => {
  const must: {}[] = [
    {
      bool: {
        should: eventCodes.map(eventCode => ({
          term: {
            'eventCode.S': eventCode,
          },
        })),
      },
    },
  ];
  if (onlyNonStricken) {
    must.push({
      term: {
        'isStricken.BOOL': false,
      },
    });
  }
  if (years && years.length) {
    if (years.length === 1) {
      must.push({
        range: {
          'receivedAt.S': {
            gte: validateDateAndCreateISO({
              day: '1',
              month: fiscal ? '10' : '1',
              year: fiscal ? `${years[0] - 1}` : `${years[0]}`,
            }),
            lt: validateDateAndCreateISO({
              day: '1',
              month: fiscal ? '10' : '1',
              year: fiscal ? `${years[0]}` : `${years[0] + 1}`,
            }),
          },
        },
      });
    } else {
      must.push({
        bool: {
          should: years.map(year => ({
            range: {
              'receivedAt.S': {
                gte: validateDateAndCreateISO({
                  day: '1',
                  month: fiscal ? '10' : '1',
                  year: fiscal ? `${year - 1}` : `${year}`,
                }),
                lt: validateDateAndCreateISO({
                  day: '1',
                  month: fiscal ? '10' : '1',
                  year: fiscal ? `${year}` : `${year + 1}`,
                }),
              },
            },
          })),
        },
      });
    }
  }
  const searchParameters = {
    body: {
      query: {
        bool: {
          must,
        },
      },
    },
    index: 'efcms-docket-entry',
  };

  return await count({
    applicationContext,
    searchParameters,
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { eventCodes, fiscal, stricken, years } = parseArguments();
  const ret = await getCountDocketEntriesByEventCodesAndYears({
    applicationContext: createApplicationContext({}),
    eventCodes,
    fiscal,
    onlyNonStricken: !stricken,
    years,
  });
  console.log(ret);
})();
