export const transformNullToUndefined = data => {
  for (const [key, item] of Object.entries(data)) {
    if (item === null) {
      delete data[key];
    }
  }
  return data;
};
