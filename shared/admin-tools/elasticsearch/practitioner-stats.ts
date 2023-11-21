// usage: npx ts-node --transpile-only shared/admin-tools/elasticsearch/practitioner-stats.ts 2022

import { requireEnvVars } from '../util';
requireEnvVars(['ENV', 'REGION']);

import { DateTime } from 'luxon';
import { createApplicationContext } from '../../../web-api/src/applicationContext';
import { searchAll } from '../../../web-api/src/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '../../src/business/utilities/DateHandler';

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

const getUniqueValues = ({
  arrayOfObjects,
  keyToFilter,
}: {
  arrayOfObjects: {}[];
  keyToFilter: string;
}) => {
  const uniqueValues = {};
  for (const someObj of arrayOfObjects) {
    if (keyToFilter in someObj) {
      if (someObj[keyToFilter] in uniqueValues) {
        uniqueValues[someObj[keyToFilter]]++;
      } else {
        uniqueValues[someObj[keyToFilter]] = 1;
      }
    }
  }
  return uniqueValues;
};

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
