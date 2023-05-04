import { search } from './searchClient';

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
export const getCasesClosedByJudge = async ({
  applicationContext,
  endDate,
  judgeName,
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
            filter: [
              {
                range: {
                  'closedDate.S': {
                    gte: `${startDate}||/h`,
                    lte: `${endDate}||/h`,
                  },
                },
              },
            ],
            must: [
              {
                match_phrase: { 'associatedJudge.S': `${judgeName}` },
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
    `Found ${results.length} closed cases associated with judge ${judgeName}`,
  );

  return results;
};
