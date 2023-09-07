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
  // add filters to return 'served'/'stricken' orders/opinions
  const documentFilters: QueryDslQueryContainer[] = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      term: {
        'isStricken.BOOL': false,
      },
    },
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

  if (params.documentEventCodes && params.documentEventCodes.length) {
    documentFilters.push({
      terms: { 'eventCode.S': params.documentEventCodes },
    });
  }

  return documentFilters;
};
