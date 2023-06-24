import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
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

  const filters: QueryDslQueryContainer[] = [];

  if (judgeName !== 'All Judges') {
    filters.push({
      match_phrase: { 'associatedJudge.S': `${judgeName}` },
    });
  }

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
            must: filters,
          },
        },
        size: 10000,
      },
      index: 'efcms-case',
    },
  });

  const judgeNameForLog =
    judgeName === 'All Judges' ? 'all judges' : `judge ${judgeName}`;

  applicationContext.logger.info(
    `Found ${results.length} closed cases associated with ${judgeNameForLog}`,
  );

  return results;
};
