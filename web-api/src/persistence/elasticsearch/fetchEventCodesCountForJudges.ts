import { COURT_ISSUED_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { search } from './searchClient';
import { searchQueryForAggregation } from './helpers/searchQueryForAggregation';

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
}) => {
  const searchQueryParams = searchQueryForAggregation({ params });

  const searchQuery: QueryDslQueryContainer = {
    bool: searchQueryParams,
  };

  const documentQuery = {
    body: {
      aggs: {
        search_field_count: {
          terms: {
            field: 'eventCode.S',
          },
        },
      },
      query: searchQuery,
      size: 0,
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
