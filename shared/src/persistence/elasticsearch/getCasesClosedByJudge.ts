import { MAX_ELASTICSEARCH_PAGINATION } from '../../../../shared/src/business/entities/EntityConstants';
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

  const mustFilters: QueryDslQueryContainer[] = [];
  const mustNotFilters: QueryDslQueryContainer[] = [];

  if (judgeName) {
    mustFilters.push({
      match_phrase: { 'associatedJudge.S': `${judgeName}` },
    });
  }

  if (judgeName === '') {
    mustNotFilters.push({
      match_phrase: { 'associatedJudge.S': 'Chief Judge' },
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
            must: mustFilters,
            must_not: mustNotFilters,
          },
        },
        size: MAX_ELASTICSEARCH_PAGINATION,
      },
      index: 'efcms-case',
    },
  });

  const judgeNameToLog = judgeName === '' ? 'all judges' : `judge ${judgeName}`;

  applicationContext.logger.info(
    `Found ${results.length} closed cases associated with ${judgeNameToLog}`,
  );

  return results;
};
