export const switchErrorActionFactory =
  (errorMap: object) =>
  ({ path, props }) => {
    let responseData = '';
    try {
      const data = props?.error?.originalError?.body;
      responseData =
        typeof data === 'string' ? data : JSON.stringify(data || '');
    } catch (e) {
      // Default path handles generically formatted errors
    }

    for (const [errorString, pathKey] of Object.entries(errorMap)) {
      if (responseData.includes(errorString)) {
        return path[pathKey]();
      }
    }
    return path.default();
  };
