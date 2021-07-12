const {
  DEADLINE_REPORT_PAGE_SIZE,
} = require('../../../business/entities/EntityConstants');
const { search } = require('../searchClient');

exports.getCaseDeadlinesByDateRange = async ({
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
          format: 'strict_date_time', // ISO-8601 time stamp
          gte: startDate,
          lte: endDate,
        },
      },
    },
  ];

  if (judge) {
    queryArray.push({
      match: {
        'associatedJudge.S': { query: judge },
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
