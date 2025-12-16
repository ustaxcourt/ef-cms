#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { getNowObject } from '@shared/business/utilities/DateHandler';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'closed-dates - Generates a spreadsheet of the closed date of all cases opened in the given year.',
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
const { begin, end } = getJsTimeframeForYear({ fiscal, year });

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getAllCasesOpenedInYear = async (): Promise<RawCase[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .selectAll('c')
        .where('c.receivedAt', '>=', begin)
        .where('c.receivedAt', '<', end)
        .orderBy('c.sortableDocketNumber', 'asc')
        .execute(),
    )
  ).map(fromKyselyCase) as RawCase[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const casesOpenedInYear = await getAllCasesOpenedInYear();
  const filename = `${OUTPUT_DIR}/closed-dates-of-cases-opened-in-${fiscal ? 'fy-' : ''}${year}.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Date Created', key: 'rcvdAtHumanized' },
    { header: 'Date Closed', key: 'closedHumanized' },
    { header: 'Case Title', key: 'caseCaption' },
    { header: 'Case Status', key: 'status' },
    { header: 'Case Type', key: 'caseType' },
  ];
  const rows = casesOpenedInYear.map(c => ({
    caseCaption: c.caseCaption,
    caseType: c.caseType,
    closedHumanized: c.closedDate?.split('T')[0] || '',
    docketNumber: c.docketNumber,
    rcvdAtHumanized: c.receivedAt?.split('T')[0],
    status: c.status,
  }));
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
