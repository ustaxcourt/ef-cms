#!/usr/bin/env npx ts-node --transpile-only

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

let positionals, values;

function usage(warning: string | undefined) {
  if (warning) {
    console.log(warning);
  }
  console.log(`npx ts-node --transpile-only ${process.argv[1]} M071,m074`);
}

const config = {
  allowPositionals: true,
  args: process.argv,
  options: {
    stricken: {
      default: false,
      description: 'include stricken docket entries when computing the results',
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
      description:
        'comma-delimited list of years, or a hyphen-separated range of years',
      short: 'y',
      type: 'string',
    },
  },
  strict: true,
} as const;

const getCountDocketEntriesByEventCodesAndYears = async ({
  applicationContext,
  eventCodes,
  onlyNonStricken,
  years,
}: {
  applicationContext: ServerApplicationContext;
  eventCodes: string[];
  onlyNonStricken: boolean;
  years?: number[];
}): Promise<number> => {
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
  // console.log('Effective Query:', JSON.stringify(searchParameters, null, 4));

  const results = await count({
    applicationContext,
    searchParameters,
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

  const eventCodes = positionals.map(s => s.toUpperCase());
  const years: number[] = parseIntsArg(values.years);
  const includeStricken = values.stricken;
  const ret = await getCountDocketEntriesByEventCodesAndYears({
    applicationContext: createApplicationContext({}),
    eventCodes,
    onlyNonStricken: !includeStricken,
    years,
  });
  if (values.verbose) {
    console.log(JSON.stringify(config, null, 4));
  }
  console.log(ret);
})();
