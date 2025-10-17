#!/usr/bin/env -S npx ts-node --transpile-only

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { DateTime } from 'luxon';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import { pick } from 'lodash';
import { sql } from 'kysely';
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

const getAllCasesClosedInYear = async (): Promise<RawCase[]> => {
  const allResults = (await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .crossJoin(
        sql`LATERAL jsonb_array_elements(case_status_history)`.as('csh'),
      )
      .select(sql`dw_case.*`.as('dwCase'))
      .where(sql`csh->>'updatedCaseStatus'`, 'in', CLOSED_STATUSES)
      .where(sql`(csh->>'date')::date`, '>=', BEGIN)
      .where(sql`(csh->>'date')::date`, '<', END)
      .execute(),
  )) as unknown as RawCase[];
  const results = [
    ...new Map(allResults.map(c => [c.docketNumber, c])).values(),
  ].map(fromKyselyCase);

  console.log(
    `Found ${results.length} cases with a "closed" status history record ` +
      `that was generated in ${fiscal ? 'fiscal' : 'calendar'} year ${year}`,
  );
  return results;
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
  const casesClosedInYear = await getAllCasesClosedInYear();
  outputCsv({ casesClosedInYear });
})();
