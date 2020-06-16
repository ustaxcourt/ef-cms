const { search } = require('./searchClient');

/**
 * getBlockedCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
exports.getBlockedCases = async ({ applicationContext, trialLocation }) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'automaticBlocked',
          'automaticBlockedDate',
          'automaticBlockedReason',
          'blocked',
          'blockedDate',
          'blockedReason',
          'caseCaption',
          'docketNumber',
          'docketNumberSuffix',
          'docketNumberWithSuffix',
          'status',
        ],
        query: {
          bool: {
            must: [
              { match: { 'preferredTrialCity.S': trialLocation } },
              { match: { 'pk.S': 'case|' } },
              { match: { 'sk.S': 'case|' } },
              {
                bool: {
                  should: [
                    { match: { 'automaticBlocked.BOOL': true } },
                    { match: { 'blocked.BOOL': true } },
                  ],
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-case',
    },
  });

  return results;
};
