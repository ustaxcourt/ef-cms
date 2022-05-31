const { search } = require('../searchClient');

exports.getSectionInboxMessages = async ({ applicationContext, section }) => {
  const hasParentParam = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: ['leadDocketNmber', 'docketNumber'],
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };

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
            hasParentParam,
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

  console.log('111111', results);

  return results;
};
