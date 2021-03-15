const {
  SERVED_PARTIES_CODES,
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
  reconciliationDateEnd,
  reconciliationDateStart,
}) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'docketNumber',
          'description',
          'docketEntryId',
          'eventCode',
          'filedBy',
          'filingDate',
          'caseCaption',
          'servedAt',
        ],
        query: {
          bool: {
            filter: {
              terms: {
                'servedPartiesCode.S': [
                  SERVED_PARTIES_CODES.RESPONDENT,
                  SERVED_PARTIES_CODES.BOTH,
                ],
              },
            },
            must: [
              {
                range: {
                  'servedAt.S': {
                    format: 'strict_date_time', // ISO-8601 time stamp
                    gte: reconciliationDateStart,
                    lte: reconciliationDateEnd,
                  },
                },
              },
              { match: { 'pk.S': 'case|' } },
              { match: { 'sk.S': 'docket-entry|' } },
            ],
          },
        },
        size: 5000,
        sort: [{ 'servedAt.S': { order: 'asc' } }],
      },
      index: 'efcms-docket-entry',
    },
  });

  return results;
};
