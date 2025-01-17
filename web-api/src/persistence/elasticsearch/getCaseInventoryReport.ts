import { CASE_INVENTORY_PRINT_REPORT_MAX_SIZE } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

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
}): Promise<{
  foundCases: RawCase[];
  totalCount: number;
}> => {
  const source = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'leadDocketNumber',
    'status',
  ];
  const size = pageSize || CASE_INVENTORY_PRINT_REPORT_MAX_SIZE;

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

  return { foundCases: results, totalCount: total };
};
