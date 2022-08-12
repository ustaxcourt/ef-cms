const { calculateISODate } = require('../../../business/utilities/DateHandler');
const { GET_MESSAGE_PARENT_CASE } = require('../helpers/searchClauses');
const { search } = require('../searchClient');

exports.getSectionOutboxMessages = async ({ applicationContext, section }) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'fromSection.S': section },
            },
            {
              range: {
                'createdAt.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  gte: filterDate,
                },
              },
            },
            GET_MESSAGE_PARENT_CASE,
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-message',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};
