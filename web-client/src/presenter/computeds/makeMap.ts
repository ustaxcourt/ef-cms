import { forEach, get } from 'lodash';

export const makeMap = (collection, itemPath) => {
  const newMap = {};
  forEach(collection, item => {
    const newKey = String(get(item, itemPath));
    newMap[newKey] = item;
  });
  return newMap;
};
