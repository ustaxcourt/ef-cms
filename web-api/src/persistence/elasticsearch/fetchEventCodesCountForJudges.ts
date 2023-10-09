import {
  computeDocumentFilters,
  computeShouldFilters,
} from './helpers/searchQueryForAggregation';
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
  documentEventCodes: any;
  judges: string[];
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
  const shouldFilters = computeShouldFilters({ params });

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
          filter: documentFilters,
          minimum_should_match: 1,
          should: shouldFilters,
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
