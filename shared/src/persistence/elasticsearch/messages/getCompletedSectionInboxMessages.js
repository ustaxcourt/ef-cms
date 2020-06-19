const { search } = require('../searchClient');

exports.getCompletedSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'completedBySection.S': { operator: 'and', query: section },
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
