#!/usr/bin/env -S npx ts-node --transpile-only

import type { RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  getTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { getDbReader } from '@web-api/database';
import { getUniqueValues } from './trial-sessions-report-helpers';
import { getNowObject } from '@shared/business/utilities/DateHandler';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'practitioner-stats - Outputs practitioner stats over a given year',
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
const { begin: fromDate, end: toDate } = getTimeframeForYear({ fiscal, year });

const getAllPractitioners = async (): Promise<RawPractitioner[]> => {
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        // .where('u.admissionsStatus', '=', 'Active')
        .where('u.barNumber', 'is not', null)
        .orderBy('u.admissionsDate', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawPractitioner[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const allPractitioners: RawPractitioner[] = await getAllPractitioners();
  const admittedInYear = allPractitioners.filter(p => {
    return p.admissionsDate >= fromDate && p.admissionsDate < toDate;
  });
  const uniquePracticeTypes = getUniqueValues({
    arrayOfObjects: admittedInYear,
    keyToFilter: 'practiceType',
  });
  const uniqueStatuses = getUniqueValues({
    arrayOfObjects: admittedInYear,
    keyToFilter: 'admissionsStatus',
  });
  const uniqueTypes = getUniqueValues({
    arrayOfObjects: admittedInYear,
    keyToFilter: 'practitionerType',
  });
  console.log({
    total: admittedInYear.length,
    uniquePracticeTypes,
    uniqueStatuses,
    uniqueTypes,
    year,
  });
})();
