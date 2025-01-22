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
import { generateCsv } from '../helpers/generate-csv';
import {
  search,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';
import PQueue from 'p-queue';

const scriptConfig: ScriptConfig = {
  description:
    'event-codes-by-year - Generate a CSV of instances of documents with the ' +
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

const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const CONCURRENCY = 8;

const cachedCases: { [key: string]: RawCase } = {};
const rows: { [k: string]: string }[] = [];

const getCase = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
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
  fiscal,
  years,
}: {
  applicationContext: ServerApplicationContext;
  eventCodes: string[];
  fiscal: boolean;
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

const addRowForDocketEntry = async ({
  applicationContext,
  de,
}: {
  applicationContext: ServerApplicationContext;
  de: RawDocketEntry;
}): Promise<void> => {
  if (!('docketNumber' in de) || !de.docketNumber) {
    return;
  }
  const c = await getCase({
    applicationContext,
    docketNumber: de.docketNumber,
  });
  if (!c) {
    return;
  }
  const judge =
    c.associatedJudge
      ?.replace('Chief Special Trial ', '')
      .replace('Special Trial ', '')
      .replace('Judge ', '') || '';
  rows.push({
    caption: c.caseCaption.replace(/\r\n|\r|\n/g, ' ').trim(),
    docketNumber: c.docketNumber,
    documentType: de.documentType,
    filed: de.receivedAt.split('T')[0],
    judge,
    status: c.status,
  });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const { eventCodes, fiscal, years } = parseArgsAndEnvVars(scriptConfig) as {
    eventCodes: string[];
    fiscal: boolean;
    years: number[];
  };
  const docketEntries = await getDocketEntriesByEventCodesAndYears({
    applicationContext,
    eventCodes,
    fiscal,
    years,
  });
  console.log(`Found ${docketEntries.length} docket entries.`);
  const queue = new PQueue({ concurrency: CONCURRENCY });
  const funcs = docketEntries.map(
    (de: RawDocketEntry) => async () =>
      await addRowForDocketEntry({ applicationContext, de }),
  );
  await queue.addAll(funcs);

  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Date Filed', key: 'filed' },
    { header: 'Document Type', key: 'documentType' },
    { header: 'Judge', key: 'judge' },
    { header: 'Status', key: 'status' },
    { header: 'Case Title', key: 'caption' },
  ];
  const filename =
    `${OUTPUT_DIR}/${eventCodes.map(ec => ec.toLowerCase()).join('-')}-filed-` +
    `in-${fiscal ? 'fy-' : ''}${years.join('-')}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
