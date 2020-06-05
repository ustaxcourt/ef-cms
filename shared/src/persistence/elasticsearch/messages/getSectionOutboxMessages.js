const { search } = require('../searchClient');

exports.getSectionOutboxMessages = async ({ applicationContext, section }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: {
            match: {
              'fromSection.S': section,
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
