import { FetchEventCodesParamsType } from '../fetchEventCodesCountForJudges';
import {
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

export const computeShouldFilters = ({
  params,
}: {
  params: FetchEventCodesParamsType;
}) => {
  const shouldFilters = [];

  if (params.judges) {
    params.judges.forEach(judgeName => {
      let matchedQueryForJudge: any;

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

      shouldFilters.push(matchedQueryForJudge);
    });
  }

  return shouldFilters;
};

export const computeDocumentFilters = ({ params }) => {
  const documentFilters: QueryDslQueryContainer[] = [
    { term: { 'entityName.S': 'DocketEntry' } },
  ];

  if (params.endDate && params.startDate) {
    documentFilters.push({
      range: {
        'filingDate.S': {
          gte: `${params.startDate}||/h`,
          lte: `${params.endDate}||/h`,
        },
      },
    });
  }

  if (params.searchType) {
    documentFilters.push({
      terms: { 'eventCode.S': params.documentEventCodes },
    });
  }

  return documentFilters;
};
