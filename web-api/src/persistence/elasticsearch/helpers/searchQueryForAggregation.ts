import {
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

export const searchQueryForAggregation = ({ params }) => {
  const documentFilter: QueryDslQueryContainer[] = [
    { term: { 'entityName.S': 'DocketEntry' } },
  ];

  const shouldFilter = [];
  if (params.searchType) {
    documentFilter.push({
      terms: { 'eventCode.S': params.documentEventCodes },
    });
  }

  if (params.judges) {
    params.judges.forEach(judgeName => {
      let matchedQueryForJudge;

      if (params.searchType === 'opinion') {
        matchedQueryForJudge = {
          match_phrase: {
            [`${OPINION_JUDGE_FIELD}.S`]: judgeName,
          },
        };
      }

      if (params.searchType === 'order') {
        matchedQueryForJudge = {
          match: {
            [`${ORDER_JUDGE_FIELD}.S`]: {
              operator: 'and',
              query: judgeName,
            },
          },
        };
      }

      shouldFilter.push(matchedQueryForJudge);
    });
  }

  if (params.endDate && params.startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${params.startDate}||/h`,
          lte: `${params.endDate}||/h`,
        },
      },
    });
  } else if (params.startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${params.startDate}||/h`,
        },
      },
    });
  }

  return {
    filter: documentFilter,
    minimum_should_match: 1, // TODO: who should own this? helper or persistence?
    should: shouldFilter,
  };
};
