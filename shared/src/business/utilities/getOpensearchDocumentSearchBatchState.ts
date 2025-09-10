export function getOpensearchDocumentSearchBatchState<T = any>(
  limit: number,
  maxSearchResults: number,
) {
  return {
    detectionCeiling: Math.min(limit + 1, maxSearchResults + 1),
    desired: Math.min(limit, maxSearchResults),
    accumulated: [] as T[],
    searchAfter: undefined as any[] | undefined,
  };
}
