export const transformNullToUndefined = <T>(data: T): T => {
  for (const [key, item] of Object.entries(data)) {
    if (item === null) {
      delete data[key];
    }
  }
  return data;
};
