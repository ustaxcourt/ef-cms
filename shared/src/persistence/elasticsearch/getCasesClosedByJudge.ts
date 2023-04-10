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
exports.getCasesByUserId = async ({
  applicationContext,
  endDate,
  startDate,
  userId,
}) => {
  // get count of all cases whos clsoed date is in the date range AND associatedJudge, judgeUserId is the judge provided
  const source = ['docketNumber'];

  const { results, total } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            should: [
              {
                term: { 'privatePractitioners.L.M.userId.S': `${userId}` },
              },
              {
                term: { 'irsPractitioners.L.M.userId.S': `${userId}` },
              },
              {
                term: { 'userId.S': `${userId}` },
              },
            ],
          },
        },
        size: 10000,
      },
      index: 'efcms-case',
    },
  });

  // Cannot use from and size to paginate through a result with more than 10,000 hits
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html
  if (total > MAX_ELASTICSEARCH_PAGINATION) {
    applicationContext.logger.warn(
      `Search for cases associated with user|${userId} returned ${total} hits; cannot paginate`,
      { userId },
    );
  }

  applicationContext.logger.info(
    `Found ${results.length} cases associated with user|${userId}`,
  );
  return results;
};
