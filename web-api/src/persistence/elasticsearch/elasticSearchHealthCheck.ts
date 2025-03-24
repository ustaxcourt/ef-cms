import { search } from '@web-api/persistence/elasticsearch/searchClient';

export const elasticSearchHealthCheck = async ({ applicationContext }) => {
  const results = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber'],
        query: {
          match_all: {},
        },
        size: 1,
      },
      index: 'efcms-docket-entry',
    },
  });

  return results;
};
