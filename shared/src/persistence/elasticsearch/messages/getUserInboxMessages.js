const { search } = require('../searchClient');

exports.getUserInboxMessages = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'toUserId.S': { operator: 'and', query: userId },
              },
            },
            {
              match: { 'isRepliedTo.BOOL': false },
            },
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
