const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

/**
 * getReadyForTrialCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the cases that are ready for trial
 */
exports.getReadyForTrialCases = async ({ applicationContext }) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber'],
        query: {
          bool: {
            must: [
              {
                match: {
                  'status.S': {
                    operator: 'and',
                    query: CASE_STATUS_TYPES.generalDocket,
                  },
                },
              },
              { match: { 'pk.S': 'case|' } },
              { match: { 'sk.S': 'case|' } },
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
