#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { applicationContext } from '@web-api/applicationContext';
import { generateCsv } from '../helpers/generate-csv';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { CLOSED_CASE_STATUSES } from '@shared/business/entities/EntityConstants';

const scriptConfig: ScriptConfig = {
  description:
    'served-docket-entries-missing-service-date-in-open-cases - Generates a ' +
    'CSV of legacy-served documents that are missing a service timestamp',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};

parseArgsAndEnvVars(scriptConfig);

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getDocketNumbersOfAllOpenCases = async (): Promise<string[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber.S'],
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'Case',
                },
              },
            ],
            must_not: [
              {
                terms: {
                  'status.S': CLOSED_CASE_STATUSES,
                },
              },
            ],
          },
        },
      },
      index: 'efcms-case',
    },
  });
  return results.map((c: RawCase) => c.docketNumber);
};

const getDocketEntriesMissingServiceDate = async ({
  openCases,
}: {
  openCases: string[];
}): Promise<RawDocketEntry[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'docketEntryId.S',
          'docketNumber.S',
          'documentType.S',
          'eventCode.S',
          'index.N',
        ],
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
                  'isLegacyServed.BOOL': true,
                },
              },
              {
                terms: {
                  'docketNumber.S': openCases,
                },
              },
            ],
            must_not: [
              {
                exists: {
                  field: 'servedAt.S',
                },
              },
            ],
          },
        },
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
};

const outputCSV = ({
  docketEntriesMissingServiceDateInOpenCases,
}: {
  docketEntriesMissingServiceDateInOpenCases: RawDocketEntry[];
}): void => {
  const filename = `${OUTPUT_DIR}/docs-missing-service-date.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Index', key: 'index' },
    { header: 'Event Code', key: 'eventCode' },
    { header: 'Document Type', key: 'documentType' },
  ];
  generateCsv({
    columns,
    filename,
    rows: docketEntriesMissingServiceDateInOpenCases,
  });
  console.log(`Generated ${filename}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const openCases = await getDocketNumbersOfAllOpenCases();
  const docketEntriesMissingServiceDateInOpenCases =
    await getDocketEntriesMissingServiceDate({ openCases });
  const uniqueCases = Array.from(
    new Set(
      docketEntriesMissingServiceDateInOpenCases.map(de => de.docketNumber),
    ),
  );
  console.log(
    `Found ${docketEntriesMissingServiceDateInOpenCases.length} docket ` +
      `entries missing service date across ${uniqueCases.length} open cases.`,
  );
  outputCSV({ docketEntriesMissingServiceDateInOpenCases });
})();
