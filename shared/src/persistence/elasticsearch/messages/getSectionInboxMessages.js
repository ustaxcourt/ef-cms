const { search } = require('../searchClient');

exports.getSectionInboxMessages = async ({ applicationContext, section }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: {
            match: {
              'toSection.S': { operator: 'and', query: section },
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
