#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { generateCsv } from '../../helpers/generate-csv';
import { pick } from 'lodash';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { Search_Request } from '@opensearch-project/opensearch/api';

const scriptConfig: ScriptConfig = {
  description:
    'sealed-documents-and-cases - Generates a CSV of sealed documents and cases.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);
const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const loadCaseFromInitialBlackstoneMigrationDb = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}): Promise<RawCase> => {
  const result = await applicationContext
    .getDocumentClient()
    .get({
      Key: {
        pk: `case|${docketNumber}`,
        sk: `case|${docketNumber}`,
      },
      TableName: 'efcms-prod-first',
    });

  return (result as unknown as RawCase) || {};
};

const getSealedCases = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}) => {
  const searchParameters: Search_Request = {
    body: {
      _source: [
        'associatedJudge.S',
        'caseCaption.S',
        'docketNumber.S',
        'docketNumberWithSuffix.S',
        'sortableDocketNumber.N',
        'status.S',
      ],
      query: {
        bool: {
          must: [
            {
              term: {
                'isSealed.BOOL': true,
              },
            },
          ],
        },
      },
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
    },
    index: 'efcms-case',
  };

  const { results } = await searchAll({ applicationContext, searchParameters });
  const cases = results.map(hit => {
    const { caseCaption, docketNumber, docketNumberWithSuffix, status } = hit;
    const associatedJudge = hit.associatedJudge
      .replace('Special Trial ', '')
      .replace('Judge ', '');
    return {
      associatedJudge,
      caseCaption,
      docketNumber,
      docketNumberWithSuffix,
      status,
    };
  });

  const docketNumbers = cases.map(c => c.docketNumber);
  const sealedDocketEntries = await getSealedDocketEntries({
    applicationContext,
    docketNumbers,
  });
  const ordersSinceDawson = await getOrdersSinceDawson({
    applicationContext,
    docketNumbers,
  });

  for (const c of cases) {
    const caseInBlackstone = await loadCaseFromInitialBlackstoneMigrationDb({
      applicationContext,
      docketNumber: c.docketNumber,
    });
    c.closedInBlackstone = caseInBlackstone?.status === 'Closed' || false;
    c.hasLegacySealedDocketEntries =
      c.docketNumber in sealedDocketEntries &&
      sealedDocketEntries[c.docketNumber]['legacySealed'].length > 0;
    c.hasOrdersSinceDawson =
      c.docketNumber in ordersSinceDawson &&
      ordersSinceDawson[c.docketNumber].length > 0;
    c.hasSealedDocketEntries =
      c.docketNumber in sealedDocketEntries &&
      sealedDocketEntries[c.docketNumber]['sealed'].length > 0;
  }
  return cases;
};

const getSealedDocketEntries = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: ServerApplicationContext;
  docketNumbers: string[];
}) => {
  const searchParameters: Search_Request = {
    body: {
      _source: [
        'docketNumber.S',
        'docketEntryId.S',
        'isLegacySealed.BOOL',
        'isSealed.BOOL',
      ],
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': docketNumbers,
              },
            },
            {
              term: {
                'entityName.S': 'DocketEntry',
              },
            },
          ],
          should: [
            {
              term: {
                'isLegacySealed.BOOL': true,
              },
            },
            {
              term: {
                'isSealed.BOOL': true,
              },
            },
          ],
        },
      },
      sort: [{ 'receivedAt.S': { order: 'asc' } }],
    },
    index: 'efcms-docket-entry',
  };

  const { results } = await searchAll({ applicationContext, searchParameters });
  const sealedDocketEntries = {};
  for (const hit of results) {
    const { docketEntryId, docketNumber, isLegacySealed, isSealed } = hit;
    if (!(docketNumber in sealedDocketEntries)) {
      sealedDocketEntries[docketNumber] = {
        legacySealed: [],
        sealed: [],
      };
    }
    if (
      isLegacySealed &&
      !(docketEntryId in sealedDocketEntries[docketNumber]['legacySealed'])
    ) {
      sealedDocketEntries[docketNumber]['legacySealed'].push(docketEntryId);
    }
    if (
      isSealed &&
      !(docketEntryId in sealedDocketEntries[docketNumber]['sealed'])
    ) {
      sealedDocketEntries[docketNumber]['sealed'].push(docketEntryId);
    }
  }
  return sealedDocketEntries;
};

const getOrdersSinceDawson = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: ServerApplicationContext;
  docketNumbers: string[];
}) => {
  const searchParameters: Search_Request = {
    body: {
      _source: ['docketNumber.S', 'docketEntryId.S'],
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': docketNumbers,
              },
            },
            {
              range: {
                'receivedAt.S': {
                  format: 'strict_date_time',
                  gte: '2021-01-01T00:00:00.00-04:00',
                },
              },
            },
            {
              term: {
                'entityName.S': 'DocketEntry',
              },
            },
            {
              wildcard: {
                'documentTitle.S': {
                  boost: 1.0,
                  rewrite: 'constant_score',
                  value: '*Order*',
                },
              },
            },
          ],
        },
      },
      sort: [{ 'receivedAt.S': { order: 'asc' } }],
    },
    index: 'efcms-docket-entry',
  };

  const { results } = await searchAll({ applicationContext, searchParameters });
  const ordersSinceDawson = {};
  for (const hit of results) {
    const { docketEntryId, docketNumber } = hit;
    if (!(docketNumber in ordersSinceDawson)) {
      ordersSinceDawson[docketNumber] = [];
    }
    if (!(docketEntryId in ordersSinceDawson[docketNumber])) {
      ordersSinceDawson[docketNumber].push(docketEntryId);
    }
  }
  return ordersSinceDawson;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const sealedCases = await getSealedCases({ applicationContext });
  const columns = [
    { header: 'Docket Number', key: 'docketNumberWithSuffix' },
    { header: 'Judge', key: 'associatedJudge' },
    { header: 'Case Title', key: 'caseCaption' },
    { header: 'Status', key: 'status' },
    { header: 'Closed in Blackstone', key: 'closedInBlackstone' },
    {
      header: 'Has Document(s) Sealed in Blackstone',
      key: 'hasLegacySealedDocketEntries',
    },
    {
      header: 'Has Document(s) Sealed in DAWSON',
      key: 'hasSealedDocketEntries',
    },
    {
      header: 'Has Order(s) Since DAWSON Launched',
      key: 'hasOrdersSinceDawson',
    },
  ];
  const rows: { [k: string]: string; }[] = [];
  for (const sc in sealedCases) {
    rows.push(
      pick(sealedCases[sc], [
        'associatedJudge',
        'caseCaption',
        'closedInBlackstone',
        'docketNumberWithSuffix',
        'hasLegacySealedDocketEntries',
        'hasOrdersSinceDawson',
        'hasSealedDocketEntries',
        'status',
      ]),
    );
  }
  const filename = `${OUTPUT_DIR}/sealed-documents-and-cases.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
