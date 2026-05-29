const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return '';
  }

  const err = error as {
    body?: unknown;
    message?: unknown;
    originalError?: {
      response?: {
        data?: unknown;
      };
    };
  };

  const responseData = err.originalError?.response?.data;

  if (typeof responseData === 'string') {
    return responseData;
  }

  if (typeof err.body === 'string') {
    return err.body;
  }

  if (typeof err.message === 'string') {
    return err.message;
  }

  return '';
};

export const switchErrorActionFactory =
  (errorMap: object) =>
  ({ path, props }: ActionProps) => {
    const errorMessage = getErrorMessage(props.error);

    for (const [errorString, pathKey] of Object.entries(errorMap)) {
      if (errorMessage.includes(errorString)) {
        return path[pathKey]();
      }
    }

    return path.default();
  };
