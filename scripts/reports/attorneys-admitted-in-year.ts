#!/usr/bin/env -S npx ts-node --transpile-only

import { type RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { generateCsv } from '../helpers/generate-csv';
import { pick } from 'lodash';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const scriptConfig: ScriptConfig = {
  description:
    'attorneys-admitted-in-year - Generates a CSV of attorneys admitted in the given year.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  parameters: {
    fiscal: {
      short: 'f',
      type: 'boolean',
    },
    year: {
      position: 0,
      required: true,
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getAttorneysAdmittedInYear = async ({
  applicationContext,
  fiscal,
  year,
}: {
  applicationContext: ServerApplicationContext;
  fiscal: boolean;
  year: number;
}): Promise<RawPractitioner[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'practitionerType.S': 'Attorney',
                },
              },
              {
                range: {
                  'admissionsDate.S': {
                    gte: fiscal
                      ? `${year - 1}-10-01T05:00:00Z`
                      : `${year}-01-01T04:00:00Z`,
                    lt: fiscal
                      ? `${year}-10-01T05:00:00Z`
                      : `${year + 1}-01-01T04:00:00Z`,
                  },
                },
              },
            ],
          },
        },
        sort: [{ 'admissionsDate.S': 'asc' }],
      },
      index: 'efcms-user',
    },
  });
  return results;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const { fiscal, year } = parseArgsAndEnvVars(scriptConfig) as {
    fiscal: boolean;
    year: number;
  };
  const attorneys: RawPractitioner[] = await getAttorneysAdmittedInYear({
    applicationContext,
    fiscal,
    year,
  });
  console.log(
    `Found ${attorneys.length} attorneys admitted in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
  );
  const columns = [
    { header: 'Bar Number', key: 'barNumber' },
    { header: 'Name', key: 'name' },
    { header: 'Practice Type', key: 'practiceType' },
    { header: 'Firm', key: 'firmName' },
    { header: 'Admissions Date', key: 'admissionsDate' },
  ];
  const rows = attorneys.map(attorney => ({
    ...pick(attorney, ['barNumber', 'firmName', 'name', 'practiceType']),
    admissionsDate: attorney.admissionsDate.split('T')[0],
  }));
  const filename = `${OUTPUT_DIR}/attorneys-admitted-in${fiscal ? '-fiscal-year' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
