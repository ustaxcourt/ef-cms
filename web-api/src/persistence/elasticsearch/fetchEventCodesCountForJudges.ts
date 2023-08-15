import { COURT_ISSUED_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  computeDocumentFilters,
  computeShouldFilters,
} from './helpers/searchQueryForAggregation';
import { search } from './searchClient';

export type ComputedAggs = {
  aggregations: { count: number; documentType: string; eventCode: string }[];
  total: number | undefined;
};

export type FetchEventCodesParamsType = {
  endDate: string;
  documentEventCodes: any;
  judges: string[];
  searchType: string;
  startDate: string;
};

export const fetchEventCodesCountForJudges = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: FetchEventCodesParamsType;
}): Promise<ComputedAggs> => {
  const documentFilters = computeDocumentFilters({ params });
  const shouldFilters = computeShouldFilters({ params });

  const documentQuery = {
    body: {
      aggs: {
        search_field_count: {
          terms: {
            field: 'eventCode.S',
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

  const computedAggregatedEventCodes =
    aggregations!.search_field_count.buckets.map(bucketObj => ({
      count: bucketObj.doc_count,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        event => event.eventCode === bucketObj.key,
      )!.documentType,
      eventCode: bucketObj.key,
    }));

  return { aggregations: computedAggregatedEventCodes, total };
};
