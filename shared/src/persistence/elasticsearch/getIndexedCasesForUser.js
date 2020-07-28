const { search } = require('./searchClient');

/**
 * getIndexedCasesForUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.statuses case status to filter by
 * @param {string} providers.userId the userId to filter cases by
 * @returns {object} the case data
 */
exports.getIndexedCasesForUser = async ({
  applicationContext,
  statuses,
  userId,
}) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'docketNumber',
          'docketNumberWithSuffix',
          'caseCaption',
          'leadDocketNumber',
          'createdAt',
          'status',
        ],
        query: {
          bool: {
            must: [
              {
                match: {
                  'pk.S': { operator: 'and', query: `user|${userId}` },
                },
              },
              { match: { 'sk.S': 'case|' } },
              { match: { 'gsi1pk.S': 'user-case|' } },
              {
                bool: {
                  should: statuses.map(status => ({
                    match: {
                      'status.S': status,
                    },
                  })),
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-user-case',
    },
  });

  return results;
};
