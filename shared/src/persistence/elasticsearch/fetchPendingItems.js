const { search } = require('./searchClient');

exports.fetchPendingItems = async ({
  applicationContext,
  judge,
  page,
  source,
}) => {
  const { PENDING_ITEMS_PAGE_SIZE } = applicationContext.getConstants();

  const size = page ? PENDING_ITEMS_PAGE_SIZE : 5000;
  const from = page ? page * size : undefined;

  const hasParentParam = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: source,
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };

  const searchParameters = {
    body: {
      _source: source,
      from,
      query: {
        bool: {
          must: [
            { match: { 'pk.S': 'case|' } },
            { match: { 'sk.S': 'docket-entry|' } },
            {
              exists: {
                field: 'servedAt',
              },
            },
            { term: { 'pending.BOOL': true } },
            hasParentParam,
          ],
        },
      },
      size,
    },
    index: 'efcms-docket-entry',
  };

  if (judge) {
    hasParentParam.has_parent.query = {
      bool: {
        must: [
          {
            match_phrase: { 'associatedJudge.S': judge },
          },
        ],
      },
    };
  }

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return { results, total };
};
