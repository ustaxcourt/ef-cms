import { DEADLINE_REPORT_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import { search } from '../searchClient';

export const getCaseDeadlinesByDateRange = async ({
  applicationContext,
  endDate,
  from = 0,
  judge,
  pageSize,
  startDate,
}) => {
  const size =
    pageSize && pageSize <= DEADLINE_REPORT_PAGE_SIZE
      ? pageSize
      : DEADLINE_REPORT_PAGE_SIZE;

  const queryArray = [];
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
      from,
      query: {
        bool: {
          filter: filterArray,
          must: queryArray,
        },
      },
      size,
      sort: [
        { 'deadlineDate.S': { order: 'asc' } },
        { 'sortableDocketNumber.N': { order: 'asc' } },
      ],
    },
    index: 'efcms-case-deadline',
  };

  const { results, total } = await search({
    applicationContext,
    searchParameters: query,
  });

  return {
    foundDeadlines: results,
    totalCount: total,
  };
};
