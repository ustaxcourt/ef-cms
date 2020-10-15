const {
  DEADLINE_REPORT_PAGE_SIZE,
} = require('../../../business/entities/EntityConstants');
const { search } = require('../searchClient');

exports.getCaseDeadlinesByDateRange = async ({
  applicationContext,
  endDate,
  from = 0,
  startDate,
}) => {
  const query = {
    body: {
      from,
      query: {
        bool: {
          must: [
            {
              range: {
                'deadlineDate.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  gte: startDate,
                },
              },
            },
            {
              range: {
                'deadlineDate.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  lte: endDate,
                },
              },
            },
          ],
        },
      },
      size: DEADLINE_REPORT_PAGE_SIZE,
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
