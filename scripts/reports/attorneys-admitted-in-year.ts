#!/usr/bin/env -S npx ts-node --transpile-only

import { type RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  getJsTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { pick } from 'lodash';
import { formatDate } from '../helpers/formatters';

const scriptConfig: ScriptConfig = {
  description:
    'attorneys-admitted-in-year - Generates a CSV of attorneys admitted in the given year.',
  environment: {
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

const getAttorneysAdmittedInYear = async (): Promise<RawPractitioner[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        .where('u.practitionerType', '=', 'Attorney')
        .where('u.admissionsDate', '>=', begin)
        .where('u.admissionsDate', '<', end)
        .orderBy('u.admissionsDate', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawPractitioner[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const attorneys: RawPractitioner[] = await getAttorneysAdmittedInYear();
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
    admissionsDate: formatDate(attorney.admissionsDate),
  }));
  const filename = `${OUTPUT_DIR}/attorneys-admitted-in${fiscal ? '-fiscal-year' : ''}-${year}.csv`;
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
