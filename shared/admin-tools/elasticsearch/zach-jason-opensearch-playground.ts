// usage: npx ts-node shared/admin-tools/elasticsearch/get-petition-counts.js 2022

import { computeDate } from '../../src/business/utilities/DateHandler';
import { pinkLog } from '../../src/tools/pinkLog';
import { search } from '../../src/persistence/elasticsearch/searchClient';
import createApplicationContext from '../../../web-api/src/applicationContext';

const getAllCases = async ({ applicationContext, params }) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  'receivedAt.S': {
                    gte: computeDate({ day: 1, month: 1, year: 2021 }),
                    lt: computeDate({ day: 1, month: 11, year: 2021 }),
                  },
                },
              },
              // {
              // match: {
              //   'blocked.BOOL': false,
              // },
              // },
              // {
              //   match: {
              //     'caseType.S': 'Whistleblower',
              //   },
              // },
            ],
          },
        },
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-case',
      size: 10000,
    },
  });
  return results;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const start = Date.now();
  const params = {
    caseStatuses: [],
    caseTypes: [],
    createEndDate: '',
    createStartDate: '',
    paperFilingMethods: [],
  };
  const petitions = await getAllCases({ applicationContext, params });
  const end = Date.now();
  pinkLog('length: ', petitions.length);
  pinkLog('time****', (end - start) / 1000);
})();

// not query-able:
// isPaper: boolean
// createdAt: Date
// caseType: String

// Questions
// why is new not in the Figma as an option for Case Status

// Count API
