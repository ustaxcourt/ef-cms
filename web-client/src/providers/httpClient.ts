import { X_FORCE_REFRESH } from '@shared/utils/headers';
import axios, { AxiosInstance } from 'axios';

const MAX_RESPONSE_SIZE_BYTES =
  Number(process.env.MAX_RESPONSE_SIZE_BYTES) || 3 * 1024 * 1024; // 3MB default

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

  if (process.env.ENV === 'local') {
    axiosClient.interceptors.response.use(response => {
      const contentLength = response.headers['content-length'];
      const responseSize = contentLength
        ? Number(contentLength)
        : JSON.stringify(response.data).length;

      if (responseSize > MAX_RESPONSE_SIZE_BYTES) {
        const error = new Error(
          `Response size ${responseSize} bytes exceeds maximum allowed size of ${MAX_RESPONSE_SIZE_BYTES} bytes`,
        );
        error.stack = stackError.stack;
        throw error;
      }

      return response;
    });
  }

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
