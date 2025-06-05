export const recordToArray = <T extends { renderKey: string }>(
  record: Record<string, T>,
): Omit<T, 'renderKey'>[] => {
  return Object.values(record).map(({ renderKey, ...rest }) => rest);
};
