import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';
import { CASE_INVENTORY_PRINT_REPORT_MAX_SIZE } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Search_Request } from '@opensearch-project/opensearch/api';

export const getCaseInventoryReport = async ({
  applicationContext,
  associatedJudge,
  from = 0,
  pageSize,
  status,
}: {
  applicationContext: ServerApplicationContext;
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

  const must: QueryContainer[] = [];

  const searchParameters: Search_Request = {
    body: {
      _source: source,
      from,
      query: {
        bool: {
          must,
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
    must.push({
      match_phrase: { 'associatedJudge.S': associatedJudge },
    });
  }

  if (status) {
    must.push({
      term: { 'status.S': status },
    });
  }

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return { foundCases: results, totalCount: total };
};
