import { v4 as uuidv4 } from 'uuid';

export const arrayToKeyedRecord = <T extends object>(
  array: T[],
): Record<string, T & { renderKey: string }> => {
  return array.reduce((acc, item) => {
    const renderKey = uuidv4();
    acc[renderKey] = {
      ...item,
      renderKey,
    };
    return acc;
  }, {});
};
