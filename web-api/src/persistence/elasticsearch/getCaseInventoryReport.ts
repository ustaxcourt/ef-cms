import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

/**
 * getCaseInventoryReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the optional judge filter
 * @param {string} providers.status the optional status filter
 * @returns {object} the items found and the total count
 */
export const getCaseInventoryReport = async ({
  applicationContext,
  associatedJudge,
  status,
}: {
  applicationContext: IApplicationContext;
  associatedJudge?: string;
  status?: string;
}): Promise<{ foundCases: RawCase[] }> => {
  const source = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'leadDocketNumber',
    'status',
  ];

  const searchParameters = {
    body: {
      _source: source,
      query: {
        bool: {
          must: [] as QueryDslQueryContainer[],
          must_not: [
            {
              term: { 'status.S': 'Closed' },
            },
            {
              term: { 'status.S': 'Closed - Dismissed' },
            },
          ],
        },
      },
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      track_total_hits: true, // to allow the count on the case inventory report UI to be accurate
    },
    index: 'efcms-case',
    size: 10000,
  };

  if (associatedJudge) {
    searchParameters.body.query!.bool!.must.push({
      match_phrase: { 'associatedJudge.S': associatedJudge },
    });
  }

  if (status) {
    searchParameters.body.query.bool.must.push({
      term: { 'status.S': status },
    });
  }

  const { results } = await search({
    applicationContext,
    searchParameters,
  });

  console.log('zzz', JSON.stringify(results[0], null, 2));

  return { foundCases: results };
};
