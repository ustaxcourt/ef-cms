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
          term: {
            'status.S': CASE_STATUS_TYPES.generalDocket,
          },
        },
        size: 5000,
      },
      index: 'efcms-case',
    },
  });

  return results;
};
