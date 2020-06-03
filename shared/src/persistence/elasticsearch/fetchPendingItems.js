const { search } = require('./searchClient');

exports.fetchPendingItems = async ({ applicationContext, judge, source }) => {
  const searchParameters = {
    body: {
      _source: source,
      query: {
        bool: {
          must: [
            { match: { 'pk.S': 'case|' } },
            { match: { 'sk.S': 'case|' } },
            { match: { 'hasPendingItems.BOOL': true } },
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-case',
  };

  if (judge) {
    searchParameters.body.query.bool.must.push({
      match_phrase: { 'associatedJudge.S': judge },
    });
  }

  const { results } = await search({
    applicationContext,
    searchParameters,
  });

  return results;
};
