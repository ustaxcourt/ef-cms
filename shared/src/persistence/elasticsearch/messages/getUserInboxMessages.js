const { GET_MESSAGE_PARENT_CASE } = require('../helpers/searchClauses');
const { search } = require('../searchClient');

exports.getUserInboxMessages = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'toUserId.S': userId },
            },
            {
              term: { 'isRepliedTo.BOOL': false },
            },
            {
              term: { 'isCompleted.BOOL': false },
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
