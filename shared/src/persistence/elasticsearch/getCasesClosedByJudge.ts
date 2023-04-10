const {
  MAX_ELASTICSEARCH_PAGINATION,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

/**
 * getCasesClosedByJudge
 *
 * @param {object} providers the providers object containing applicationContext
 * @param {string} providers.applicationContext application context
 * @param {string} providers.judge judge
 * @param {string} providers.startDate start date
 * @param {string} providers.endDate end date
 * @returns {array} array of docket numbers
 */
exports.getCasesClosedByJudge = async ({
  applicationContext,
  endDate,
  judgeUserId,
  startDate,
}) => {
  const source = ['status'];

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            should: [
              {
                'closedDate.S': {
                  gte: `${startDate}||/h`,
                  lte: `${endDate}||/h`,
                },
              },
              {
                term: { 'judgeUserId.S': `${judgeUserId}` },
              },
            ],
          },
        },
        size: 10000,
      },
      index: 'efcms-case',
    },
  });

  applicationContext.logger.info(
    `Found ${results.length} closed cases associated with judge ${judgeUserId}`,
  );

  return results;
};
