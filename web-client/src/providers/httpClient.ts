import {
  DEPLOYMENT_TIMESTAMP_STORAGE_KEY,
  X_DEPLOYMENT_TIMESTAMP,
  X_MANUAL_REFRESH_REQUIRED,
  getHeaderValue,
} from '@shared/utils/headers';
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

let axiosClient: AxiosInstance;
let areInterceptorsRegistered = false;

const getStoredDeploymentTimestamp = (): string | undefined => {
  return (
    window.localStorage.getItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY) || undefined
  );
};

const setStoredDeploymentTimestamp = (
  headers: Record<string, unknown>,
): void => {
  const deploymentTimestamp = getHeaderValue(headers, X_DEPLOYMENT_TIMESTAMP);

  if (deploymentTimestamp) {
    window.localStorage.setItem(
      DEPLOYMENT_TIMESTAMP_STORAGE_KEY,
      deploymentTimestamp,
    );
  }
};

export const getHttpClient = (
  forceRefreshCallback: () => void,
): AxiosInstance => {
  /*
  We are creating this error and interceptor to get around a known issue with axios stack traces: https://github.com/axios/axios/issues/2387.
  When axios throws an error, the stack trace does not show who called axios. This helps accurately display a stack trace when axios throws an error.
  */
  const stackError = new Error(); // Look at the stack trace for more information on the error.
  axiosClient = axiosClient || axios.create();

  if (!areInterceptorsRegistered) {
    axiosClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const deploymentTimestamp = getStoredDeploymentTimestamp();

        if (deploymentTimestamp) {
          config.headers.set(X_DEPLOYMENT_TIMESTAMP, deploymentTimestamp);
        }

        return config;
      },
    );

    axiosClient.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        setStoredDeploymentTimestamp(
          response.headers as Record<string, unknown>,
        );

        return response;
      },
      async error => {
        setStoredDeploymentTimestamp(
          (error.response?.headers || {}) as Record<string, unknown>,
        );

        const shouldForceManualRefresh =
          getHeaderValue(error.response?.headers, X_MANUAL_REFRESH_REQUIRED) ===
          'true';

        if (shouldForceManualRefresh) {
          await forceRefreshCallback();
        }

        error.stack = stackError.stack;
        throw error;
      },
    );

    areInterceptorsRegistered = true;
  }

  return axiosClient;
};
