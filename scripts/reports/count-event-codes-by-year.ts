#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { count } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

const scriptConfig: ScriptConfig = {
  description:
    'count-event-codes-by-year - Count instances of documents with the ' +
    'given event code(s) filed within the given duration.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  parameters: {
    eventCodes: {
      commaDelimited: true,
      position: 0,
      required: true,
      transform: 'toUpperCase',
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    stricken: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    years: {
      default: [`${DateTime.now().toObject().year}`],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
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
  const { eventCodes, fiscal, stricken, years } = parseArgsAndEnvVars(
    scriptConfig,
  ) as {
    eventCodes: string[];
    fiscal: boolean;
    stricken: boolean;
    years: number[];
  };
  const ret = await getCountDocketEntriesByEventCodesAndYears({
    applicationContext: createApplicationContext({}),
    eventCodes,
    fiscal,
    onlyNonStricken: !stricken,
    years,
  });
  console.log(ret);
})();
