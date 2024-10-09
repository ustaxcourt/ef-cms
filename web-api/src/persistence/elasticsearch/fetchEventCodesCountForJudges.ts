import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';

export type CaseDocumentsCountType = {
  count: number;
  documentType: string | undefined;
  eventCode: string;
};

export type AggregatedEventCodesType = {
  aggregations: CaseDocumentsCountType[];
  total: number;
};

export type FetchEventCodesParamsType = {
  endDate: string;
  documentEventCodes: string[];
  judgeIds: string[];
  startDate: string;
};

export const fetchEventCodesCountForJudges = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: FetchEventCodesParamsType;
}): Promise<AggregatedEventCodesType> => {
  const documentFilters = computeDocumentFilters({ params });

  const documentQuery = {
    body: {
      aggs: {
        search_field_count: {
          terms: {
            field: 'eventCode.S',
            size: params.documentEventCodes.length,
          },
        },
      },
      query: {
        bool: {
          filter: [
            ...documentFilters,
            {
              has_parent: {
                parent_type: 'case',
                query: {
                  bool: {
                    filter: [
                      {
                        terms: { 'associatedJudgeId.S': params.judgeIds },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      size: 0,
      track_total_hits: true,
    },
    index: 'efcms-docket-entry',
  };

  const { aggregations, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  const bucketCountAggs = aggregations!.search_field_count.buckets.reduce(
    (acc, bucketObj) => {
      return {
        ...acc,
        [bucketObj.key]: bucketObj.doc_count,
      };
    },
    {},
  );

  const computedAggregatedEventCodes = params.documentEventCodes.map(
    eventCode => {
      return {
        count: bucketCountAggs[eventCode] || 0,
        eventCode,
      };
    },
  );

  return { aggregations: computedAggregatedEventCodes, total };
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
