// usage: npx ts-node shared/admin-tools/elasticsearch/get-petition-counts.js 2022

import { computeDate } from '../../src/business/utilities/DateHandler';
import { pinkLog } from '../../src/tools/pinkLog';
import { searchAll } from '../../src/persistence/elasticsearch/searchClient';
import createApplicationContext from '../../../web-api/src/applicationContext';

const getAllPetitions = async ({ applicationContext }) => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  'eventCode.S': 'P',
                },
              },
              {
                range: {
                  'receivedAt.S': {
                    gte: computeDate({ day: 1, month: 1, year: 2021 }),
                    lt: computeDate({ day: 1, month: 1, year: 2022 }),
                  },
                },
              },
            ],
          },
        },
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const petitions = await getAllPetitions({ applicationContext });
  pinkLog(petitions, petitions.length);
})();
