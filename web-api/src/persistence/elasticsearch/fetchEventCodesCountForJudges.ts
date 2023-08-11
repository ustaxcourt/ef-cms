import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '@shared/business/entities/EntityConstants';
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
    documentEventCodes: (typeof OPINION_EVENT_CODES_WITH_BENCH_OPINION)[number];
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

  return { aggregations, total };
};
