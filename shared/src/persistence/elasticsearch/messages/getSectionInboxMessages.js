const { search } = require('../searchClient');

exports.getSectionInboxMessages = async ({ applicationContext, section }) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'toSection.S': section },
            },
            {
              term: { 'isRepliedTo.BOOL': false },
            },
            {
              match: { 'isCompleted.BOOL': false },
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
