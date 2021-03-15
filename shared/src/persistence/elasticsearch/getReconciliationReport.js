const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

/**
 * getReconciliationReport
 * all items served on the IRS (indicated by servedParty of R or B) on a specific day (12:00am-11:59:59pm ET)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the docket entries
 */
exports.getReconciliationReport = async ({
  applicationContext,
  reconciliationDate,
}) => {
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
