import { Search_Request } from '@opensearch-project/opensearch/api';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { search } from '../searchClient';
import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';

export const getCaseDeadlinesByDateRange = async ({
  applicationContext,
  endDate,
  judge,
  startDate,
}) => {
  const queryArray: QueryContainer[] = [];
  const filterArray = [
    {
      range: {
        'deadlineDate.S': {
          gte: `${startDate}||/h`,
          lte: `${endDate}||/h`,
        },
      },
    },
  ];

  if (judge) {
    queryArray.push({
      simple_query_string: {
        default_operator: 'and',
        fields: ['associatedJudge.S'],
        query: `"${judge}"`,
      },
    });
  }

  const query: Search_Request = {
    body: {
      query: {
        bool: {
          filter: filterArray,
          must: queryArray,
        },
      },
      sort: [
        { 'deadlineDate.S': { order: 'asc' } },
        { 'sortableDocketNumber.N': { order: 'asc' } },
      ],
    },
    index: 'efcms-case-deadline',
    size: MAX_ELASTICSEARCH_PAGINATION,
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return { foundDeadlines: results };
};
