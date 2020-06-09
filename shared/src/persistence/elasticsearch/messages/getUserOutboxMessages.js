const { search } = require('../searchClient');

exports.getUserOutboxMessages = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: {
            match: {
              'fromUserId.S': { operator: 'and', query: userId },
            },
          },
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
