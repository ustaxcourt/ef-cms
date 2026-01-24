#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CASE_STATUS_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { generateCsv } from '../helpers/generate-csv';
import { pick } from 'lodash';
import { choose } from '../helpers/prompts';

const scriptConfig: ScriptConfig = {
  description: 'deficiencies - Generates a CSV of cases with IRS deficiencies',
  environment: {
    env: 'ENV',
    home: 'HOME',
  },
  parameters: {
    city: {
      description: 'Filter results by preferred trial city',
      short: 'c',
      type: 'boolean',
    },
    max: {
      default: '0',
      description: 'Maximum IRS deficiency amount to include in report',
      required: false,
      short: 'x',
      transform: 'number',
      type: 'string',
    },
    min: {
      default: '0',
      description: 'Minimum IRS deficiency amount to include in report',
      required: false,
      short: 'n',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { city, home, max, min } = parseArgsAndEnvVars(scriptConfig) as {
  city: boolean;
  home: string;
  max: number;
  min: number;
};

type tDeficiencyCase = {
  associatedJudge: string;
  caption: string;
  docketNumber: string;
  irsDeficiencyAmount: number;
  preferredTrialCity: string;
};

const trialCityStrings = TRIAL_CITY_STRINGS.slice().sort((a, b) => {
  const [aCity, aState] = a.split(', ');
  const [bCity, bState] = b.split(', ');

  if (aState !== bState) {
    return aState.localeCompare(bState);
  }
  return aCity.localeCompare(bCity);
});

const getDeficiencyCases = async (
  filterByTrialCity: string | undefined,
): Promise<tDeficiencyCase[]> => {
  return (await getDbReader(reader => {
    let cteQuery = reader
      .selectFrom('dwCase as c')
      .crossJoin(sql`LATERAL jsonb_array_elements(c.statistics)`.as('stats'))
      .select(({ fn }) => [
        'c.associatedJudge',
        'c.caption',
        'c.docketNumber',
        fn
          .sum<number>(sql<number>`(stats->>'irsDeficiencyAmount')::float`)
          .as('irsDeficiencyAmount'),
        'c.preferredTrialCity',
        'c.status',
      ])
      .where(sql`stats->>'irsDeficiencyAmount'`, 'is not', null)
      .where('c.status', 'not in', [
        CASE_STATUS_TYPES.closed,
        CASE_STATUS_TYPES.closedDismissed,
        CASE_STATUS_TYPES.onAppeal,
      ])
      .groupBy([
        'c.docketNumber',
        'c.associatedJudge',
        'c.caption',
        'c.preferredTrialCity',
        'c.status',
      ]);
    if (filterByTrialCity) {
      cteQuery = cteQuery.where('c.preferredTrialCity', '=', filterByTrialCity);
    }

    let query = reader
      .with('deficiencyCteQuery', () => cteQuery)
      .selectFrom('deficiencyCteQuery')
      .selectAll();
    if (min !== max) {
      if (min > 0) {
        query = query.where('irsDeficiencyAmount', '>=', min);
      }
      if (max > 0) {
        query = query.where('irsDeficiencyAmount', '<=', max);
      }
    }

    return query.orderBy('irsDeficiencyAmount', 'desc').execute();
  })) as unknown as tDeficiencyCase[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  let filterByTrialCity: string | undefined;
  if (city) {
    filterByTrialCity = await choose('Trial location', trialCityStrings);
  }

  const today = createISODateString().split('T')[0];
  const OUTPUT_DIR = `${home}/Documents`;
  let outputFilename = 'deficiencies_';
  if (min !== max) {
    if (max === 0) {
      outputFilename += `greater_than_${min}_`;
    } else if (min === 0) {
      outputFilename += `less_than_${max}_`;
    } else {
      outputFilename += `${min}-${max}_`;
    }
  }
  if (filterByTrialCity) {
    outputFilename += `${filterByTrialCity.split(',')[0].replace(' ', '_').replace('.', '').toLowerCase()}_`;
  }
  outputFilename += `${today}.csv`;
  const filename = `${OUTPUT_DIR}/${outputFilename}`;

  const deficiencyCases = await getDeficiencyCases(filterByTrialCity);

  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Case Title', key: 'caption' },
    { header: 'Judge', key: 'judge' },
    { header: 'Case Status', key: 'status' },
    { header: 'Preferred Trial Location', key: 'preferredTrialCity' },
    { header: 'IRS Deficiency Amount', key: 'irsDeficiencyAmount' },
  ];
  const rows = [
    ...deficiencyCases.map(result => ({
      ...pick(result, ['caption', 'docketNumber', 'status']),
      irsDeficiencyAmount: result.irsDeficiencyAmount
        ? `${result.irsDeficiencyAmount.toFixed(2)}`
        : '0',
      judge:
        result.associatedJudge
          ?.replace('Chief Special Trial ', '')
          .replace('Special Trial ', '')
          .replace('Judge ', '') || '',
      preferredTrialCity: result.preferredTrialCity || '',
    })),
  ];

  console.log(`Found ${deficiencyCases.length} deficiency cases`);
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
