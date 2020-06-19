const { search } = require('../searchClient');

exports.getCompletedUserInboxMessages = async ({
  applicationContext,
  userId,
}) => {
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
              match: { 'isCompleted.BOOL': true },
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
