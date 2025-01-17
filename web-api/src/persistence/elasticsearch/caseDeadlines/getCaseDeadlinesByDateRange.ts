import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { search } from '../searchClient';

export const getCaseDeadlinesByDateRange = async ({
  applicationContext,
  endDate,
  judge,
  startDate,
}) => {
  const queryArray: {}[] = [];
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

  const query = {
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
