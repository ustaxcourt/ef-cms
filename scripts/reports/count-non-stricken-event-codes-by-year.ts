// usage: npx ts-node --transpile-only scripts/reports/count-non-stricken-event-codes-by-year.ts M071,M074 2021-2022 [includeStricken]  > ~/Desktop/m071s-and-m074s-filed-2021-2022.csv

import { count } from '@web-api/persistence/elasticsearch/searchClient';
import { createApplicationContext } from '@web-api/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

requireEnvVars(['ENV', 'REGION']);

const includeStricken = !!(process.argv.length > 4);
if (includeStricken) {
  console.log('including stricken docket entries');
}

const getCountDocketEntriesByEventCodesAndYears = async ({
  applicationContext,
  eventCodes,
  onlyNonStricken,
  years,
}: {
  applicationContext: IApplicationContext;
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
  const applicationContext = createApplicationContext({});

  const eventCodes = process.argv[2].split(',');
  const years: number[] = [];
  const yearArg = process.argv[3];
  if (yearArg.includes('-')) {
    const [lower, upper] = yearArg.split('-');
    for (let i = Number(lower); i <= Number(upper); i++) {
      years.push(Number(i));
    }
  } else {
    const yearStrings = yearArg.split(',');
    for (const year of yearStrings) {
      years.push(Number(year));
    }
  }

  const ret = await getCountDocketEntriesByEventCodesAndYears({
    applicationContext,
    eventCodes,
    onlyNonStricken: !includeStricken,
    years,
  });
  console.log(ret);
})();
