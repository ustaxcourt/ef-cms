#!/usr/bin/env -S npx ts-node --transpile-only

import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { applicationContext } from '@web-api/applicationContext';
import {
  count,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

const scriptConfig: ScriptConfig = {
  description:
    'represented-count-by-year - Generates a table comparing counts of ' +
    'represented and pro se cases in a given calendar or fiscal year',
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

const getDocketNumbersOfCasesFiledInYear = async (): Promise<string[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'DocketEntry',
                },
              },
              {
                term: {
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
  return Array.from(
    new Set(results.map((p: RawDocketEntry) => p.docketNumber)),
  );
};

const countCasesWithRepresentation = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<number> => {
  return await count({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'Case',
                },
              },
              {
                terms: {
                  'docketNumber.S': docketNumbers,
                },
              },
              {
                exists: {
                  field: 'privatePractitioners.L.M.userId.S',
                },
              },
            ],
          },
        },
      },
      index: 'efcms-case',
    },
  });
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
