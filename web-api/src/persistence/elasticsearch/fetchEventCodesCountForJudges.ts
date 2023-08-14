import { COURT_ISSUED_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  getDocumentFilters,
  getShouldFilters,
} from './helpers/searchQueryForAggregation';
import { search } from './searchClient';

export type ComputedAggs = {
  aggregations: { count: number; documentType: string; eventCode: string }[];
  total: number | undefined;
};

export const fetchEventCodesCountForJudges = async ({
  applicationContext,
  params,
}: {
  applicationContext: IApplicationContext;
  params: {
    endDate: string;
    documentEventCodes: any;
    judges: string[];
    searchType: string;
    startDate: string;
  };
}): Promise<ComputedAggs> => {
  const documentFilter = getDocumentFilters({ params });
  const shouldFilter = getShouldFilters({ params });

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
          filter: documentFilter,
          minimum_should_match: 1,
          should: shouldFilter,
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
