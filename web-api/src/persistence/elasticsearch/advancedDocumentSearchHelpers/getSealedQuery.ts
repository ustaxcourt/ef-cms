import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';

export const getSealedQuery = () => {
  const sealedDocumentMustNotQuery: QueryContainer[] = [
    {
      term: { 'isSealed.BOOL': true },
    },
    { term: { 'sealedTo.S': 'External' } },
  ];

  const sealedCaseQuery: QueryContainer = {
    bool: {
      must: [
        {
          bool: {
            minimum_should_match: 1,
            should: [
              {
                bool: {
                  must: {
                    term: { 'isSealed.BOOL': false },
                  },
                },
              },
              {
                bool: {
                  must_not: {
                    exists: { field: 'isSealed' },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  return { sealedCaseQuery, sealedDocumentMustNotQuery };
};
