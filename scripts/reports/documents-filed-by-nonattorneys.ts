#!/usr/bin/env -S npx ts-node --transpile-only

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
    'documents-filed-by-non-attorneys - Generates a CSV of documents filed by non-attorneys.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  parameters: {
    eventCode: {
      default: 'P',
      long: 'event-code',
      required: false,
      short: 'e',
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    year: {
      default: '2024',
      required: false,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getNonAttorneys = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<{ [k: string]: string }> => {
  const nonAttorneys = {};
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'admissionsStatus.S': 'Active',
                },
              },
              {
                term: {
                  'practitionerType.S': 'Non-Attorney',
                },
              },
            ],
          },
        },
      },
      index: 'efcms-user',
    },
  });
  for (const result of results) {
    nonAttorneys[result.pk.replace('user|', '')] = result.name;
  }
  return nonAttorneys;
};

const getDocuments = async ({
  applicationContext,
  eventCode,
  fiscal,
  userIds,
  year,
}: {
  applicationContext: ServerApplicationContext;
  eventCode: string;
  fiscal: boolean;
  userIds: string[];
  year: number;
}): Promise<RawDocketEntry[]> => {
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
                  'eventCode.S': eventCode,
                },
              },
              {
                terms: {
                  'userId.S': userIds,
                },
              },
              {
                range: {
                  'receivedAt.S': {
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
  const { eventCode, fiscal, year } = parseArgsAndEnvVars(scriptConfig) as {
    eventCode: string;
    fiscal: boolean;
    year: number;
  };
  console.log(
    `Looking for documents with event code ${eventCode} filed by non-attorneys ` +
      `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}...`,
  );
  const nonAttorneys = await getNonAttorneys({ applicationContext });
  console.log(
    `Found ${Object.keys(nonAttorneys).length} non-attorneys with active admissions status.`,
  );
  const documents = await getDocuments({
    applicationContext,
    eventCode,
    fiscal,
    userIds: Object.keys(nonAttorneys),
    year,
  });
  if (!documents.length) {
    console.log(
      `Found 0 documents with event code ${eventCode} filed by non-attorneys ` +
        `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
    );
    return;
  }
  console.log(
    `Found ${documents.length} ${documents[0].documentType}` +
      `${documents.length === 1 ? '' : 's'} filed by non-attorneys ` +
      `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
  );
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Document Title', key: 'documentTitle' },
    { header: 'Filed On', key: 'filedOn' },
    { header: 'Filed By', key: 'filedBy' },
  ];
  const rows = documents.map(de => ({
    ...pick(de, ['docketNumber', 'documentTitle']),
    filedBy: nonAttorneys[de.userId!],
    filedOn: de.receivedAt.split('T')[0],
  }));
  const docType = documents[0].documentType.replace(' ', '-').toLowerCase();
  const filename = `${OUTPUT_DIR}/${docType}s-filed-by-non-attorneys-in${fiscal ? '-fiscal-year' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
