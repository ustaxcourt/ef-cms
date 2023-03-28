// usage: npx ts-node shared/admin-tools/elasticsearch/get-petition-counts.js 2022

import { computeDate } from '../../src/business/utilities/DateHandler';
import { pinkLog } from '../../src/tools/pinkLog';
import { searchAll } from '../../src/persistence/elasticsearch/searchClient';
import createApplicationContext from '../../../web-api/src/applicationContext';

const getAllCases = async ({ applicationContext }) => {
  const { results } = await searchAll({
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
              //   match: {
              //     'isPaper.BOOL': false,
              //   },
              // },
              // {
              //   match: {
              //     'caseType.S': 'Whistleblower',
              //   },
              // },
            ],
          },
        },
        size: 1000,
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-case',
    },
  });
  return results;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const start = Date.now();
  const petitions = await getAllCases({ applicationContext });
  const end = Date.now();
  pinkLog(petitions.length);
  pinkLog('time****', (end - start) / 1000);
})();

// not queryable:
// isPaper: boolean
// createdAt: Date
// caseType: String

// Questions
// why is new not in the Figma as an option for Case Status
