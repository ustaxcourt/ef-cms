// usage: npx ts-node --transpile-only scripts/reports/practitioner-stats.ts 2022

import { getUniqueValues } from './trial-sessions-report-helpers';
import { requireEnvVars } from '../../shared/admin-tools/util';
requireEnvVars(['ENV', 'REGION']);

import { DateTime } from 'luxon';
import { createApplicationContext } from '@web-api/applicationContext';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';
import type { RawPractitioner } from '@shared/business/entities/Practitioner';

const year = Number(process.argv[2]) || Number(DateTime.now().toObject().year);

const fromDate = validateDateAndCreateISO({
  day: '1',
  month: '1',
  year: `${year}`,
});
const toDate = validateDateAndCreateISO({
  day: '1',
  month: '1',
  year: `${year + 1}`,
});

const getAllPractitioners = async (
  applicationContext: IApplicationContext,
): Promise<Array<RawPractitioner>> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            filter: {
              exists: {
                field: 'barNumber.S',
              },
            },
          },
        },
      },
      index: 'efcms-user',
    },
  });
  return results;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const allPractitioners: RawPractitioner[] =
    await getAllPractitioners(applicationContext);
  const admittedInYear = allPractitioners.filter(p => {
    return p.admissionsDate >= fromDate! && p.admissionsDate < toDate!;
  });
  const uniqueEmployers = getUniqueValues({
    arrayOfObjects: admittedInYear,
    keyToFilter: 'employer',
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
    uniqueEmployers,
    uniqueStatuses,
    uniqueTypes,
    year,
  });
})();
