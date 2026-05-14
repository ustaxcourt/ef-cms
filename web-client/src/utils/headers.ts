export const DEPLOYMENT_TIMESTAMP_STORAGE_KEY: string = 'deploymentTimestamp';
export const X_DEPLOYMENT_TIMESTAMP: string = 'X-Deployment-Timestamp';
export const X_FORCE_REFRESH: string = 'X-Force-Refresh';
export const X_MANUAL_REFRESH_REQUIRED: string = 'X-Manual-Refresh-Required';
export const X_TERMINAL_USER: string = 'X-Terminal-User';

export const EXPOSED_RESPONSE_HEADERS: string[] = [
  X_DEPLOYMENT_TIMESTAMP,
  X_FORCE_REFRESH,
  X_MANUAL_REFRESH_REQUIRED,
  X_TERMINAL_USER,
];

export const getHeaderValue = (
  headers: Record<string, unknown> | undefined,
  headerName: string,
): string | undefined => {
  if (!headers) {
    return undefined;
  }

  if (typeof headers.get === 'function') {
    const value =
      headers.get(headerName) || headers.get(headerName.toLowerCase());

    if (typeof value === 'string') {
      return value;
    }
  }

  const headerValue = headers[headerName] || headers[headerName.toLowerCase()];

  if (typeof headerValue === 'string') {
    return headerValue;
  }

  return undefined;
};
