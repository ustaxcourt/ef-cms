export const recordToSortedArray = <T extends { renderKey: string }>(
  record: Record<string, T>,
): Omit<T, 'renderKey'>[] => {
  return Object.values(record)
    .sort((a, b) => (a.renderKey > b.renderKey ? 1 : -1))
    .map(({ renderKey, ...rest }) => rest);
};
