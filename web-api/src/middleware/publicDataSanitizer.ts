import {
  findUnauthorizedPublicFields as findUnauthorizedPublicFieldsCore,
  UnauthorizedPublicFieldFinding,
} from '@shared/business/utilities/publicDataValidation';
import { getHeaderValue } from '@shared/utils/headers';

type ApiGatewayLikeEvent = {
  headers?: Record<string, unknown>;
  path?: string;
  url?: string;
};

const PUBLIC_PATH_REGEX = /\/public-api(\/|$)/i;

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

  return host.includes('public-api.') || PUBLIC_PATH_REGEX.test(path);
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
