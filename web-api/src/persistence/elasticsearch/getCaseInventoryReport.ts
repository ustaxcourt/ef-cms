import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

/**
 * getCaseInventoryReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the optional judge filter
 * @param {number} providers.from the item index to start from
 * @param {number} providers.pageSize the number of items to retrieve
 * @param {string} providers.status the optional status filter
 * @returns {object} the items found and the total count
 */
export const getCaseInventoryReport = async ({
  applicationContext,
  associatedJudge,
  from = 0,
  pageSize,
  status,
}: {
  applicationContext: IApplicationContext;
  associatedJudge?: string;
  from?: number;
  pageSize?: number;
  status?: string;
}) => {
  const source = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'leadDocketNumber',
    'status',
  ];
  const { CASE_INVENTORY_MAX_PAGE_SIZE } = applicationContext.getConstants();
  const size =
    pageSize && pageSize <= CASE_INVENTORY_MAX_PAGE_SIZE
      ? pageSize
      : CASE_INVENTORY_MAX_PAGE_SIZE;

  const searchParameters = {
    body: {
      _source: source,
      from,
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
      size,
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      track_total_hits: true, // to allow the count on the case inventory report UI to be accurate
    },
    index: 'efcms-case',
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

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return {
    foundCases: results,
    totalCount: total,
  };
};
