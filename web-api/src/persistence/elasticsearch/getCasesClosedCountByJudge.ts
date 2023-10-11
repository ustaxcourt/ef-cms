import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { CasesClosedReturnType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export const getCasesClosedCountByJudge = async ({
  applicationContext,
  endDate,
  judges,
  startDate,
}: {
  applicationContext: IApplicationContext;
  endDate: string;
  judges: string[];
  startDate: string;
}): Promise<CasesClosedReturnType> => {
  const source = ['status'];

  const shouldFilters: QueryDslQueryContainer[] = [];

  judges.forEach(judge => {
    shouldFilters.push({
      match_phrase: { 'associatedJudge.S': `${judge}` },
    });
  });

  const documentQuery = {
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
      track_total_hits: true,
    },
    index: 'efcms-case',
  };

  const { aggregations, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  const computedAggregatedClosedCases =
    aggregations!.closed_cases.buckets.reduce((bucketObj, item) => {
      return {
        ...bucketObj,
        [item.key]: item.doc_count,
      };
    }, {});

  const results = aggregations!.closed_cases.buckets.length
    ? computedAggregatedClosedCases
    : {
        [CASE_STATUS_TYPES.closed]: 0,
        [CASE_STATUS_TYPES.closedDismissed]: 0,
      };

  return { aggregations: results, total };
};
