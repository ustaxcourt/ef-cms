import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';

export const getSealedQuery = () => {
  const sealedDocumentMustNotQuery: QueryContainer[] = [
    {
      term: { 'isSealed.BOOL': true },
    },
    { term: { 'sealedTo.S': 'External' } },
  ];

  return { sealedDocumentMustNotQuery };
};
