import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

export const getSealedQuery = () => {
  const sealedDocumentMustNotQuery: QueryDslQueryContainer[] = [
    {
      term: { 'isSealed.BOOL': true },
    },
    { term: { 'sealedTo.S': 'External' } },
  ];

  const sealedCaseQuery: QueryDslQueryContainer = {
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
