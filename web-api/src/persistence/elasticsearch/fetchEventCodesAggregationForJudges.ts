import { search } from './searchClient';
import { searchQueryForAggregation } from './helpers/searchQueryForAggregation';

export const fetchEventCodesAggregationForJudges = async ({
  applicationContext,
  params,
}) => {
  const searchQuery = searchQueryForAggregation({ params });

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
