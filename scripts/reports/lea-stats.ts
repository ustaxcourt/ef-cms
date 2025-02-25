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
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import PQueue from 'p-queue';

const scriptConfig: ScriptConfig = {
  description:
    'lea-stats - Generates statistics related to Limited Entry of Appearance documents.',
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
const caseCache: { [k: string]: RawCase } = {};
const concurrency = 50;

const getLEAsFiledInYear = async ({
  applicationContext,
  fiscal,
  year,
}: {
  applicationContext: ServerApplicationContext;
  fiscal: boolean;
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
                  'eventCode.S': 'LEA',
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

const getCaseEntity = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}): Promise<RawCase> => {
  if (!(docketNumber in caseCache)) {
    caseCache[docketNumber] = await getCaseByDocketNumber({
      applicationContext,
      docketNumber,
      includeConsolidatedCases: false,
    });
  }
  return caseCache[docketNumber];
};

const getNocFiledAfterLeaInCase = ({
  docketNumber,
  leaReceivedAt,
}: {
  docketNumber: string;
  leaReceivedAt: string;
}): RawDocketEntry | undefined => {
  if (!(docketNumber in caseCache)) {
    return;
  }
  const subsequentNOCs = caseCache[docketNumber].docketEntries.filter(de => {
    return de.eventCode === 'NOC' && de.receivedAt > leaReceivedAt;
  });
  if (!subsequentNOCs) {
    return;
  }
  return subsequentNOCs[0];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { fiscal, year } = parseArgsAndEnvVars(scriptConfig) as {
    fiscal: boolean;
    year: number;
  };
  const applicationContext = createApplicationContext({});

  const leas = await getLEAsFiledInYear({ applicationContext, fiscal, year });
  console.log(
    `Found ${leas.length} Limited Entry of Appearance documents filed in ` +
      `in ${fiscal ? 'fiscal' : 'calendar'} year ${year}.`,
  );
  const docketNumbers = [...new Set(leas.map(de => de.docketNumber))];
  const queue = new PQueue({ concurrency });
  const funcs = docketNumbers.map(
    (docketNumber: string) => async () =>
      await getCaseEntity({ applicationContext, docketNumber }),
  );
  await queue.addAll(funcs);

  const procedureTypeAggs: { [k: string]: number } = {};
  for (const caseEntity of Object.values(caseCache)) {
    if (!(caseEntity.procedureType in procedureTypeAggs)) {
      procedureTypeAggs[caseEntity.procedureType] = 0;
    }
    procedureTypeAggs[caseEntity.procedureType]++;
  }
  const subsequentNocs: string[] = [];
  const rows: {}[] = [];
  for (const lea of leas) {
    const subsequentNoc = getNocFiledAfterLeaInCase({
      docketNumber: lea.docketNumber,
      leaReceivedAt: lea.receivedAt,
    });
    if (subsequentNoc && subsequentNoc.docketEntryId) {
      subsequentNocs.push(subsequentNoc.docketEntryId);
    }
    rows.push({
      docketNumber: lea.docketNumber,
      leaFiledDate: lea.receivedAt.split('T')[0],
      leaIndex: lea.index,
      nocFiledDate: subsequentNoc?.receivedAt.split('T')[0] ?? '',
      nocIndex: subsequentNoc?.index ?? '',
      procedureType: caseCache[lea.docketNumber].procedureType,
    });
  }
  const uniqueSubsequentNocs = [...new Set(subsequentNocs)];
  const stats = {
    procedureTypeAggs,
    totalUniqueCases: 0,
    totalUniqueLeas: leas.length,
    totalUniqueSubsequentNocs: uniqueSubsequentNocs.length,
  };
  for (const pt in procedureTypeAggs) {
    stats.totalUniqueCases += procedureTypeAggs[pt];
  }

  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Procedure Type', key: 'procedureType' },
    { header: 'LEA Index', key: 'leaIndex' },
    { header: 'LEA Filed', key: 'leaFiledDate' },
    { header: 'Subsequent NOC Index', key: 'nocIndex' },
    { header: 'Subsequent NOC Filed', key: 'nocFiledDate' },
  ];
  const filename = `${OUTPUT_DIR}/leas-filed-in${fiscal ? '-fiscal-year' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
  console.log('\nStatistics:', stats);
})();
