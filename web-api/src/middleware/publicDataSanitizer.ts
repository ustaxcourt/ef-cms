import { findUnauthorizedPublicFields as findUnauthorizedPublicFieldsCore } from '@shared/business/utilities/publicDataValidation';
import type { UnauthorizedPublicFieldFinding } from '@shared/business/utilities/publicDataValidation';
import { getHeaderValue } from '@shared/utils/headers';

type ApiGatewayLikeEvent = {
  headers?: Record<string, unknown>;
  path?: string;
  url?: string;
};

const PUBLIC_API_PATH_REGEX = /(?:^|\/)public-api(?:\/|$)/i;
const PUBLIC_API_HOST_REGEX = /^public-api(?:-[a-z0-9-]+)?\./i;
const LOCAL_PUBLIC_API_HOST_REGEX = /^(?:localhost|127\.0\.0\.1):4001$/i;

function getRequestPath(event: ApiGatewayLikeEvent): string {
  if (typeof event.path === 'string') {
    return event.path;
  }
  if (typeof event.url === 'string') {
    return event.url;
  }
  return '';
}

export function isPublicSiteRequest(event: ApiGatewayLikeEvent): boolean {
  const hostHeader = getHeaderValue(event.headers, 'host');
  const host = typeof hostHeader === 'string' ? hostHeader.toLowerCase() : '';
  const path = getRequestPath(event);

  return (
    PUBLIC_API_HOST_REGEX.test(host) ||
    LOCAL_PUBLIC_API_HOST_REGEX.test(host) ||
    PUBLIC_API_PATH_REGEX.test(path)
  );
}

export function findUnauthorizedPublicFields(args: {
  event: ApiGatewayLikeEvent;
  response: unknown;
}): UnauthorizedPublicFieldFinding[] {
  const path = getRequestPath(args.event);
  return findUnauthorizedPublicFieldsCore({
    data: args.response,
    url: path,
  });
}
