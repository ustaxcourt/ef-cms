export const switchErrorActionFactory =
  (errorMap: object) =>
  ({ path, props }) => {
    for (let [errorString, pathKey] of Object.entries(errorMap)) {
      if (props.error.originalError.response.data.includes(errorString)) {
        return path[pathKey]();
      }
    }
    return path.default();
  };
