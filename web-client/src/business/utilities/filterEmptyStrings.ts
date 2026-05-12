export const filterEmptyStrings = <T>(params: T): T => {
  const removeEmpty = (obj: Record<string, unknown>): void => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        removeEmpty(value as Record<string, unknown>);
      } else if (value === '') {
        delete obj[key];
      }
    });
  };

  if (params && typeof params === 'object') {
    removeEmpty(params as Record<string, unknown>);
  }

  return params;
};
