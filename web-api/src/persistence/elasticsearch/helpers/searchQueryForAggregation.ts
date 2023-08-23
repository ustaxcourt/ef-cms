import { FetchEventCodesParamsType } from '../fetchEventCodesCountForJudges';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

export const computeShouldFilters = ({
  params,
}: {
  params: FetchEventCodesParamsType;
}) => {
  const shouldFilters: QueryDslQueryContainer[] = [];

  if (params.judges) {
    params.judges.forEach(judgeName => {
      shouldFilters.push({
        match: {
          ['signedJudgeName.S']: {
            operator: 'and',
            query: judgeName,
          },
        },
      });

      shouldFilters.push({
        match: {
          ['judge.S']: judgeName,
        },
      });
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
