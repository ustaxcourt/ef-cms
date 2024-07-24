// usage: npx ts-node --transpile-only scripts/reports/event-codes-by-year.ts M071,M074 2021-2022 > ~/Desktop/m071s-and-m074s-filed-2021-2022.csv

import { createApplicationContext } from '@web-api/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import {
  search,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

requireEnvVars(['ENV', 'REGION']);

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
