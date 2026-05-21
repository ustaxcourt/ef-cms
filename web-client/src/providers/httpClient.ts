import {
  DEPLOYMENT_TIMESTAMP_STORAGE_KEY,
  X_DEPLOYMENT_TIMESTAMP,
  X_FORCE_REFRESH,
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
let currentForceRefreshCallback: (() => void) | undefined;

const getStoredDeploymentTimestamp = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return (
    window.localStorage.getItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY) || undefined
  );
};

const setStoredDeploymentTimestamp = (
  headers: Record<string, unknown>,
): void => {
  if (typeof window === 'undefined') return;
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
  apiUrl: string,
): AxiosInstance => {
  axiosClient = axiosClient || axios.create();

  currentForceRefreshCallback = forceRefreshCallback;

  if (!areInterceptorsRegistered) {
    axiosClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        (config as any)._stackError = new Error();

        const deploymentTimestamp = getStoredDeploymentTimestamp();

        const isExternalRequest = config.url && !config.url.startsWith(apiUrl);

        if (deploymentTimestamp && !isExternalRequest) {
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
            'true' ||
          getHeaderValue(error.response?.headers, X_FORCE_REFRESH) === 'true';

        if (shouldForceManualRefresh) {
          await currentForceRefreshCallback?.();
        }

        const stackError = error.config?._stackError;
        if (stackError) {
          error.stack = stackError.stack;
        }
        throw error;
      },
    );

    areInterceptorsRegistered = true;
  }

  return axiosClient;
};
