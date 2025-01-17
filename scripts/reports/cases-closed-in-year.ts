#!/usr/bin/env -S npx ts-node --transpile-only

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { generateCsv } from '../helpers/generate-csv';
import { pick } from 'lodash';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

const scriptConfig: ScriptConfig = {
  description:
    'cases-closed-in-year - Generates a spreadsheet of cases closed at any ' +
    'point in the given year, even if they were later reopened.',
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

const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const CLOSED_STATUSES: string[] = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
];
const BEGIN = validateDateAndCreateISO({
  day: '1',
  month: fiscal ? '10' : '1',
  year: fiscal ? `${Number(year) - 1}` : year,
})!;
const END = validateDateAndCreateISO({
  day: '1',
  month: fiscal ? '10' : '1',
  year: fiscal ? year : `${Number(year) + 1}`,
})!;

const getAllCasesClosedInFiscalYear = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<RawCase[]> => {
  const { results }: { results: RawCase[] } = await searchAll({
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
                  'caseStatusHistory.L.M.updatedCaseStatus.S': CLOSED_STATUSES,
                },
              },
              {
                range: {
                  'caseStatusHistory.L.M.date.S': {
                    gte: BEGIN,
                    lt: END,
                  },
                },
              },
            ],
          },
        },
        sort: [{ 'sortableDocketNumber.N': 'asc' }],
      },
      index: 'efcms-case',
    },
  });
  console.log(
    `Found ${results.length} cases with a "closed" status history record and` +
      ` a status history record generated in fiscal year ${year}`,
  );
  const ret = results.filter(c => wasClosedThisFiscalYear(c));
  console.log(
    `Filtered results to ${ret.length} cases having a "closed"` +
      ` status history record that was generated in fiscal year ${year}`,
  );
  return ret;
};

const wasClosedThisFiscalYear = (c: RawCase): boolean => {
  let closedThisFiscalYear = false;
  for (const csh of c.caseStatusHistory || []) {
    if (
      csh.date &&
      csh.date >= BEGIN &&
      csh.date < END &&
      csh.updatedCaseStatus &&
      CLOSED_STATUSES.includes(csh.updatedCaseStatus)
    ) {
      closedThisFiscalYear = true;
      break;
    }
  }
  return closedThisFiscalYear;
};

const outputCsv = ({
  casesClosedInYear,
}: {
  casesClosedInYear: RawCase[];
}): void => {
  const filename = `${OUTPUT_DIR}/cases-closed-in-${fiscal ? 'fy-' : ''}${year}.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Case Title', key: 'caption' },
    { header: 'Judge', key: 'judge' },
    { header: 'Case Status', key: 'status' },
    { header: 'Closed Date', key: 'closedDateHumanized' },
  ];
  const rows = casesClosedInYear.map(c => {
    const judge =
      c.associatedJudge
        ?.replace('Chief Special Trial ', '')
        .replace('Special Trial ', '')
        .replace('Judge ', '') || '';
    const closedDateHumanized =
      (c.caseStatusHistory || [])
        .reverse()
        .find(
          csh =>
            CLOSED_STATUSES.includes(csh.updatedCaseStatus) &&
            csh.date >= BEGIN &&
            csh.date < END,
        )
        ?.date.split('T')[0] || '';
    const caption = c.caseCaption.replace(/\r\n|\r|\n/g, ' ').trim();
    return {
      ...pick(c, ['docketNumber', 'status']),
      caption,
      closedDateHumanized,
      judge,
    };
  });
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const casesClosedInYear = await getAllCasesClosedInFiscalYear({
    applicationContext,
  });
  outputCsv({ casesClosedInYear });
})();
