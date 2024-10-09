import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { CasesClosedReturnType } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export const getCasesClosedCountByJudge = async ({
  applicationContext,
  endDate,
  judgeIds,
  startDate,
}: {
  applicationContext: IApplicationContext;
  endDate: string;
  judgeIds: string[];
  startDate: string;
}): Promise<CasesClosedReturnType> => {
  const source = ['status'];

  const mustClause: QueryDslQueryContainer[] = [];

  mustClause.push({
    range: {
      'closedDate.S': {
        gte: `${startDate}||/h`,
        lte: `${endDate}||/h`,
      },
    },
  });

  mustClause.push({ terms: { 'associatedJudgeId.S': judgeIds } });

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
          must: mustClause,
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
