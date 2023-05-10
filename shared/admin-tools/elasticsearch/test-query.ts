// usage: npx ts-node --transpile-only shared/admin-tools/elasticsearch/test-query.ts
import { computeDate } from '../../src/business/utilities/DateHandler';
import { createApplicationContext } from '../../../web-api/src/applicationContext';
import { pinkLog } from '../../src/tools/pinkLog';
import { search } from '../../src/persistence/elasticsearch/searchClient';

const getAllCases = async (
  applicationContext: any,
  params: { searchAfter: number },
) => {
  const source = [
    'associatedJudge',
    'isPaper',
    'createdAt',
    'procedureType',
    'caseCaption',
    'caseType',
    'docketNumber',
    'preferredTrialCity',
    'receivedAt',
    'status',
    'highPriority',
  ];
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            must: [
              {
                range: {
                  'createdAt.S': {
                    gte: computeDate({ day: 1, month: 1, year: 2021 }),
                    lt: computeDate({ day: 1, month: 11, year: 2023 }),
                  },
                },
              },
            ],
          },
        },
        search_after: [params.searchAfter],
        sort: [{ 'createdAt.S': 'asc' }],
      },
      index: 'efcms-case',
      size: 10,
      track_total_hits: true,
    },
  });
  return results;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const start = Date.now();
  const params = {
    searchAfter: 0,
  };
  const petitions = await getAllCases(applicationContext, params);
  const end = Date.now();
  pinkLog(petitions);
  pinkLog('time****', (end - start) / 1000);
})();
