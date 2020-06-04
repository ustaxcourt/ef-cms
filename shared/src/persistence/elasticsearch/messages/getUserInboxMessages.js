const { search } = require('../searchClient');

exports.getUserInboxMessages = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: {
            match: {
              'toUserId.S': userId,
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
