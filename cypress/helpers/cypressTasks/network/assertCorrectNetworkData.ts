import type { CapturedNetworkPayload } from '../../../local-only/support/commands';
import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';
import type { UnauthorizedPublicFieldFinding } from '@shared/business/utilities/publicDataValidation';
import { getHeaderValue } from '@shared/utils/headers';

export type UnauthorizedFieldFinding = {
  url: string;
  method: string;
  location: string;
  entityName?: string;
  fieldName: string;
  matchPreview: string;
};

type InternalUnauthorizedFieldFinding = Omit<
  UnauthorizedFieldFinding,
  'url' | 'method' | 'location'
>;

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
  url: string;
}): boolean {
  if (!args.body) {
    return false;
  }

  if (args.shouldRejectAssetUrls && NON_API_ASSET_PATH_REGEX.test(args.url)) {
    return false;
  }

  const contentType = getHeaderValue(args.headers, 'content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return false;
  }

  return isRecord(args.body) || Array.isArray(args.body);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function assertCorrectNetworkData(
  payloads: CapturedNetworkPayload[],
): PublicDataValidationResult {
  const findings: UnauthorizedFieldFinding[] = [];

  for (const payload of payloads) {
    if (
      shouldValidateJsonBody({
        body: payload.responseBody,
        headers: payload.responseHeaders,
        shouldRejectAssetUrls: true,
        url: payload.url,
      })
    ) {
      appendFindingsForBody({
        body: payload.responseBody,
        findings,
        location: 'responseBody',
        method: payload.method,
        url: payload.url,
      });
    }

    if (
      shouldValidateJsonBody({
        body: payload.requestBody,
        headers: payload.requestHeaders,
        shouldRejectAssetUrls: false,
        url: payload.url,
      })
    ) {
      appendFindingsForBody({
        body: payload.requestBody,
        findings,
        location: 'requestBody',
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
  location: 'requestBody' | 'responseBody';
  method: string;
  url: string;
}): void {
  const bodyFindings: InternalUnauthorizedFieldFinding[] =
    findUnauthorizedPublicFields({
      data: args.body,
      url: args.url,
    }).map((finding: UnauthorizedPublicFieldFinding) => ({
      entityName: finding.entityName,
      fieldName: finding.fieldName,
      matchPreview: finding.matchPreview,
    }));

  args.findings.push(
    ...bodyFindings.map(finding => ({
      ...finding,
      url: args.url,
      method: args.method,
      location: args.location,
    })),
  );
}
