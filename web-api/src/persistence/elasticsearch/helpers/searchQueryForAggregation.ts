import {
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

export const getShouldFilters = ({ params }) => {
  const shouldFilter = [];

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

  return shouldFilter;
};

export const getDocumentFilters = ({ params }) => {
  const documentFilter: QueryDslQueryContainer[] = [
    { term: { 'entityName.S': 'DocketEntry' } },
  ];

  if (params.endDate && params.startDate) {
    documentFilter.push({
      range: {
        'filingDate.S': {
          gte: `${params.startDate}||/h`,
          lte: `${params.endDate}||/h`,
        },
      },
    });
  }

  if (params.searchType) {
    documentFilter.push({
      terms: { 'eventCode.S': params.documentEventCodes },
    });
  }

  return documentFilter;
};
