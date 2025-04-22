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
import { getUniqueValues } from './trial-sessions-report-helpers';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';
import type { RawPractitioner } from '@shared/business/entities/Practitioner';

const scriptConfig: ScriptConfig = {
  description:
    'practitioner-stats - Outputs practitioner stats over a given year',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  parameters: {
    year: {
      default: `${DateTime.now().toObject().year}`,
      position: 0,
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { year } = parseArgsAndEnvVars(scriptConfig) as { year: number };

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
  applicationContext: ServerApplicationContext,
): Promise<RawPractitioner[]> => {
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
