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
  judges,
  pageSize,
  startDate,
}) => {
  const source = ['status'];

  const shouldFilters: QueryDslQueryContainer[] = [];

  if (judges.length) {
    judges.forEach(judge => {
      shouldFilters.push({
        match_phrase: { 'associatedJudge.S': `${judge}` },
      });
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
            minimum_should_match: 1,
            should: shouldFilters,
          },
        },
        size: pageSize || MAX_ELASTICSEARCH_PAGINATION,
      },
      index: 'efcms-case',
    },
  });

  const judgeNameToLog =
    judges.length > 1 ? 'all judges' : `judge ${judges[0]}`;

  applicationContext.logger.info(
    `Found ${results.length} closed cases associated with ${judgeNameToLog}`,
  );

  return results;
};
