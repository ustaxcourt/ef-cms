import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';
import type {
  UnauthorizedPublicFieldFinding,
  UnauthorizedPublicFieldFindingCore,
} from '@shared/business/utilities/publicDataValidation';
import { getHeaderValue } from '@shared/utils/headers';

export type CapturedNetworkPayload = {
  url: string;
  method: string;
  statusCode?: number;
  requestBody?: unknown;
  responseBody?: unknown;
  requestHeaders?: Record<string, unknown>;
  responseHeaders?: Record<string, unknown>;
};

export type UnauthorizedFieldFinding = UnauthorizedPublicFieldFindingCore & {
  url: string;
  method: string;
  location: 'responseBody';
};

export type PublicDataValidationResult = {
  passed: boolean;
  findings: UnauthorizedFieldFinding[];
};

const NON_API_ASSET_PATH_REGEX =
  /\.(?:avif|bmp|css|eot|gif|ico|jpe?g|js|map|otf|png|svg|ttf|webp|woff2?)$/i;

function shouldValidateJsonBody(args: {
  body: unknown;
  headers: Record<string, unknown> | undefined;
  shouldRejectAssetUrls: boolean;
  statusCode?: number;
  url: string;
}): boolean {
  if (args.body === undefined) {
    return false;
  }

  if (
    args.statusCode !== undefined &&
    (args.statusCode < 200 || args.statusCode >= 300)
  ) {
    return false;
  }

  if (args.shouldRejectAssetUrls && NON_API_ASSET_PATH_REGEX.test(args.url)) {
    return false;
  }

  const contentType = getHeaderValue(args.headers, 'content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return false;
  }

  return true;
}

function isPublicApiUrl(url: string): boolean {
  const parsedUrl = new URL(url, 'http://localhost');
  const isPublicApiHost =
    /^public-api(?:-[a-z0-9-]+)?\./i.test(parsedUrl.hostname) ||
    /^(?:localhost|127\.0\.0\.1):4001$/i.test(parsedUrl.host);

  return parsedUrl.pathname.startsWith('/public-api/') || isPublicApiHost;
}

export function assertCorrectNetworkData(
  payloads: CapturedNetworkPayload[],
): PublicDataValidationResult {
  const findings: UnauthorizedFieldFinding[] = [];

  for (const payload of payloads) {
    if (!isPublicApiUrl(payload.url)) {
      continue;
    }

    if (payload.method.toUpperCase() === 'HEAD') {
      continue;
    }

    if (
      shouldValidateJsonBody({
        body: payload.responseBody,
        headers: payload.responseHeaders,
        shouldRejectAssetUrls: true,
        statusCode: payload.statusCode,
        url: payload.url,
      })
    ) {
      appendFindingsForBody({
        body: payload.responseBody,
        findings,
        method: payload.method,
        url: payload.url,
      });
    }
  }

  return {
    passed: findings.length === 0,
    findings,
  };
}

function appendFindingsForBody(args: {
  body: unknown;
  findings: UnauthorizedFieldFinding[];
  method: string;
  url: string;
}): void {
  const relevantFindings: UnauthorizedPublicFieldFinding[] =
    findUnauthorizedPublicFields({
      data: args.body,
      method: args.method,
      url: args.url,
    }).filter(finding => finding.type !== 'not_validated');

  args.findings.push(
    ...relevantFindings.map((finding): UnauthorizedFieldFinding => ({
      entityName: finding.entityName,
      fieldName: finding.fieldName,
      matchPreview: finding.matchPreview,
      url: args.url,
      method: args.method,
      location: 'responseBody',
    })),
  );
}
