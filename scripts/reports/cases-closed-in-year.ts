#!/usr/bin/env -S npx ts-node --transpile-only

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  getTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  calculateDifferenceInDays,
  getIsoFromJsDate,
  getJsDateFromIso,
  getNowObject,
} from '@shared/business/utilities/DateHandler';
import {
  formatCaseCaption,
  formatDate,
  formatJudgeName,
} from '../helpers/formatters';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import { pick } from 'lodash';
import { sql } from 'kysely';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'cases-closed-in-year - Generates a spreadsheet of cases closed at any ' +
    'point in the given year, even if they were later reopened.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    year: {
      default: `${thisYear}`,
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
const { begin, end } = getTimeframeForYear({ fiscal, year });

const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const CLOSED_STATUSES: string[] = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
];

const getClosedDateFromCaseStatusHistory = async (): Promise<RawCase[]> => {
  return (await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .crossJoin(
        sql`LATERAL jsonb_array_elements(case_status_history)`.as('csh'),
      )
      .select(sql`dw_case.*`.as('dwCase'))
      .where(eb =>
        eb.or([
          eb.and([
            eb('closedDate', '>=', getJsDateFromIso(begin)),
            eb('closedDate', '<', getJsDateFromIso(end)),
          ]),
          eb.and([
            eb(sql`csh->>'updatedCaseStatus'`, 'in', CLOSED_STATUSES),
            eb(sql`(csh->>'date')::date`, '>=', begin),
            eb(sql`(csh->>'date')::date`, '<', end),
          ]),
        ]),
      )
      .execute(),
  )) as unknown as RawCase[];
};

const getClosedDateFromCaseRecord = async (): Promise<RawCase[]> => {
  return (await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .selectAll('c')
      .where('c.closedDate', '>=', getJsDateFromIso(begin))
      .where('c.closedDate', '<', getJsDateFromIso(end))
      .execute(),
  )) as unknown as RawCase[];
};

const getAllCasesClosedInYear = async (): Promise<RawCase[]> => {
  const allResults =
    Number(year) < 2024
      ? await getClosedDateFromCaseRecord()
      : await getClosedDateFromCaseStatusHistory();
  const results = [
    ...new Map(allResults.map(c => [c.docketNumber, c])).values(),
  ].map(fromKyselyCase);

  console.log(
    `Found ${results.length} cases with a "closed" status history record ` +
      `that was generated in ${fiscal ? 'fiscal' : 'calendar'} year ${year}`,
  );
  return results;
};

const petitionServiceDates = new Map<string, string>();

const getPetitionServiceDates = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<void> => {
  const results = (await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .leftJoin('dwCase as c', 'de.docketNumber', 'c.docketNumber')
      .select(['de.docketNumber', 'de.servedAt'])
      .where('de.eventCode', '=', 'P')
      .where('de.docketNumber', 'in', docketNumbers)
      .orderBy('de.receivedAt', 'asc')
      .execute(),
  )) as { docketNumber: string; servedAt: Date | null }[];
  for (const r of results) {
    if (
      r.servedAt &&
      Object.prototype.toString.call(r.servedAt) === '[object Date]'
    ) {
      const petitionServiceDateISO = getIsoFromJsDate(r.servedAt);
      if (petitionServiceDateISO) {
        petitionServiceDates.set(r.docketNumber, petitionServiceDateISO);
      }
    }
  }
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
    { header: 'Petition Service Date', key: 'petitionServedDateHumanized' },
    { header: 'Closed Date', key: 'closedDateHumanized' },
    { header: 'Number of Days Open', key: 'daysOpen' },
  ];
  const totals: { [k: string]: number } = { cases: 0, daysOpen: 0 };
  const rows = casesClosedInYear.map(c => {
    const judge = formatJudgeName(c.associatedJudge);
    const closedDateISO =
      (c.caseStatusHistory || [])
        .reverse()
        .find(
          csh =>
            CLOSED_STATUSES.includes(csh.updatedCaseStatus) &&
            csh.date >= begin &&
            csh.date < end,
        )?.date ||
      c.closedDate ||
      '';
    const closedDateHumanized = formatDate(closedDateISO);
    const caption = formatCaseCaption(c.caseCaption);
    const petitionServedDateISO = petitionServiceDates.get(c.docketNumber)!;
    const petitionServedDateHumanized = formatDate(petitionServedDateISO);
    const daysOpen = calculateDifferenceInDays(
      closedDateISO,
      petitionServedDateISO,
    );
    if (daysOpen > 0) {
      totals.cases += 1;
      totals.daysOpen += daysOpen;
    }
    return {
      ...pick(c, ['docketNumber', 'status']),
      caption,
      closedDateHumanized,
      daysOpen,
      judge,
      petitionServedDateHumanized,
    };
  });
  const averageAge = Math.round(totals.daysOpen / totals.cases);
  console.log(
    `Cases closed in ${fiscal ? 'fiscal' : 'calendar'} year ${year} were open for an average of ${averageAge} days`,
  );
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const casesClosedInYear = await getAllCasesClosedInYear();
  await getPetitionServiceDates({
    docketNumbers: casesClosedInYear.map(c => c.docketNumber),
  });
  outputCsv({ casesClosedInYear });
})();
