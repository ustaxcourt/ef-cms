import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

export const getSealedQuery = () => {
  const sealedDocumentMustNotQuery: QueryDslQueryContainer[] = [
    {
      term: { 'isSealed.BOOL': true },
    },
    { term: { 'sealedTo.S': 'External' } },
  ];

  return { sealedDocumentMustNotQuery };
};
