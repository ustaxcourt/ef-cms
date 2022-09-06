const { GET_PARENT_CASE } = require('../helpers/searchClauses');
const { search } = require('../searchClient');

exports.getDocumentQCInboxForUser = async ({ applicationContext, userId }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                'assigneeId.S': userId,
              },
            },
            {
              prefix: { 'pk.S': 'case|' },
            },
            {
              prefix: { 'sk.S': 'work-item|' },
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
            GET_PARENT_CASE,
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-work-item',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};
