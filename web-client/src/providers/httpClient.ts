import { X_FORCE_REFRESH } from '@shared/utils/headers';
import axios, { AxiosInstance } from 'axios';

let axiosClient: AxiosInstance;

export const getHttpClient = (
  forceRefreshCallback: () => void,
): AxiosInstance => {
  /*
  We are creating this error and interceptor to get around a known issue with axios stack traces: https://github.com/axios/axios/issues/2387.
  When axios throws an error, the stack trace does not show who called axios. This helps accurately display a stack trace when axios throws an error.
  */
  const stackError = new Error(); // Look at the stack trace for more information on the error.
  axiosClient = axiosClient || axios.create();

  axiosClient.interceptors.response.use(undefined, async error => {
    const shouldForceRefresh =
      error.response.headers.get(X_FORCE_REFRESH) === 'true';

    if (shouldForceRefresh) {
      await forceRefreshCallback();
    }

    error.stack = stackError.stack;
    throw error;
  });

  return axiosClient;
};
