const { search } = require('../searchClient');

exports.getDocumentQCInboxForUser = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'pk.S': `user|${userId}`,
              },
            },
            {
              match: {
                'sk.S': 'work-item|',
              },
            },
          ],
          must_not: {
            exists: {
              field: 'completedAt.S',
            },
          },
          should: [
            {
              term: {
                'highPriority.BOOL': {
                  boost: 500,
                  value: true,
                },
              },
            },
          ],
        },
      },
      size: 1000,
    },
    index: 'efcms-work-item',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};
