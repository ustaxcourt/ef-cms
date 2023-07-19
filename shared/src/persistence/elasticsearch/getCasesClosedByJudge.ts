import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { CasesClosedType } from '@web-client/presenter/judgeActivityReportState';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';
import { sum } from 'lodash';

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
  startDate,
}): Promise<CasesClosedType> => {
  const source = ['status'];

  const shouldFilters: QueryDslQueryContainer[] = [];

  if (judges.length) {
    judges.forEach(judge => {
      shouldFilters.push({
        match_phrase: { 'associatedJudge.S': `${judge}` },
      });
    });
  }

  const { aggregations } = await search({
    applicationContext,
    formatBody: false,
    searchParameters: {
      body: {
        _source: source,
        aggs: {
          closed_cases: {
            terms: {
              field: 'status.S',
            },
          },
        },
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
        size: 0,
      },
      index: 'efcms-case',
    },
  });

  const computedAggregatedClosedCases =
    aggregations.closed_cases.buckets.reduce((bucketObj, item) => {
      return {
        ...bucketObj,
        [item.key]: item.doc_count,
      };
    }, {});

  const results: CasesClosedType = aggregations.closed_cases.buckets.length
    ? computedAggregatedClosedCases
    : {
        [CASE_STATUS_TYPES.closed]: 0,
        [CASE_STATUS_TYPES.closedDismissed]: 0,
      };

  const totalNumberOfClosedCases = sum(Object.values(results));

  const judgeNameToLog =
    judges.length > 1 ? 'all judges' : `judge ${judges[0]}`;

  applicationContext.logger.info(
    `Found ${totalNumberOfClosedCases} closed cases associated with ${judgeNameToLog}`,
  );

  return results;
};
