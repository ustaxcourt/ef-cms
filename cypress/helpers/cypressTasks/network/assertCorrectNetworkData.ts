/* eslint-disable complexity */
import type { CapturedNetworkPayload } from '../../../local-only/support/commands';
import { getHeaderValue } from '@shared/utils/headers';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { PublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { PublicTrialSessionInfoDTO } from '@shared/business/dto/trialSessions/PublicTrialSessionInfoDTO';

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

const FEATURE_FLAG_PATH_REGEX = /\/system\/feature-flag\/?$/i;
const DOWNLOAD_URL_PATH_REGEX = /\/public-document-download-url\/?$/i;
const HEALTH_CHECK_PATH_REGEX = /\/health\/?$/i;

const PUBLIC_ENTITY_FACTORIES = {
  PublicCase: (): PublicCase =>
    new PublicCase(
      {},
      {
        authorizedUser: undefined,
      },
    ),
  PublicCaseDTO: (): PublicCaseDTO =>
    new PublicCaseDTO(
      new PublicCase(
        {},
        {
          authorizedUser: undefined,
        },
      ),
    ),
  PublicCaseSearchResult: (): PublicCaseSearchResult =>
    new PublicCaseSearchResult({}),
  PublicContact: (): PublicContact => new PublicContact({}),
  PublicDocketEntry: (): PublicDocketEntry => new PublicDocketEntry({}),
  PublicDocumentSearchResult: (): PublicDocumentSearchResult =>
    new PublicDocumentSearchResult({}),
  PublicTrialSessionDetails: (): PublicTrialSessionDetails =>
    new PublicTrialSessionDetails({}),
  PublicTrialSessionInfoDTO: (): PublicTrialSessionInfoDTO =>
    new PublicTrialSessionInfoDTO(new TrialSession({})),
  PublicUser: (): PublicUser => new PublicUser({}),
  RestrictedCase: (): RestrictedCase =>
    new RestrictedCase({ docketNumber: '' }),
  RestrictedCaseDTO: (): RestrictedCaseDTO =>
    new RestrictedCaseDTO(new RestrictedCase({ docketNumber: '' })),
} as const;

function extractAllowedFieldsByEntityName(): Map<string, Set<string>> {
  const allowedFieldsByEntityName = new Map<string, Set<string>>();

  for (const [entityName, createEntity] of Object.entries(
    PUBLIC_ENTITY_FACTORIES,
  )) {
    const instance = createEntity();
    const allowedFields = new Set<string>(Object.keys(instance));
    allowedFields.add('entityName');
    allowedFieldsByEntityName.set(entityName, allowedFields);
  }

  return allowedFieldsByEntityName;
}

const ALLOWED_FIELDS_BY_ENTITY_NAME = extractAllowedFieldsByEntityName();

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

function redactPreview(value: string): string {
  if (value.length <= 8) return '[redacted]';
  return `${value.slice(0, 4)}...[redacted]...${value.slice(-4)}`;
}

function isTopLevelArrayItemPath(path: string): boolean {
  return /^\[\d+\]$/.test(path);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumericValue(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isAllowedSystemStatusValue(value: unknown): boolean {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    isNumericValue(value)
  );
}

function validateUrlOnlyObject(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): InternalUnauthorizedFieldFinding[] {
  return validateObjectByFieldRule({
    isAllowed: (key, value) => key === 'url' && typeof value === 'string',
    obj: args.obj,
    path: args.path,
    url: args.url,
  });
}

function validateEntityMetadata(args: {
  path: string;
  candidateEntityName?: string;
}): {
  findings: InternalUnauthorizedFieldFinding[];
  allowedFields?: Set<string>;
} {
  const findings: InternalUnauthorizedFieldFinding[] = [];

  if (!args.candidateEntityName) {
    return {
      findings,
    };
  }

  const allowedFields = ALLOWED_FIELDS_BY_ENTITY_NAME.get(
    args.candidateEntityName,
  );

  if (!allowedFields) {
    findings.push({
      entityName: args.candidateEntityName,
      fieldName: args.path || 'entityName',
      matchPreview: redactPreview(args.candidateEntityName),
    });
  }

  return {
    allowedFields,
    findings,
  };
}

function validateNumericObject(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): InternalUnauthorizedFieldFinding[] {
  return validateObjectByFieldRule({
    isAllowed: (_key, value) => isNumericValue(value),
    obj: args.obj,
    path: args.path,
    url: args.url,
  });
}

function validateSystemStatusObject(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): InternalUnauthorizedFieldFinding[] {
  return validateObjectByFieldRule({
    isAllowed: (_key, value) => isAllowedSystemStatusValue(value),
    obj: args.obj,
    path: args.path,
    url: args.url,
  });
}

function validateObjectByFieldRule(args: {
  isAllowed: (key: string, value: unknown) => boolean;
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): InternalUnauthorizedFieldFinding[] {
  const findings: InternalUnauthorizedFieldFinding[] = [];

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = args.path ? `${args.path}.${key}` : key;

    if (args.isAllowed(key, value)) {
      continue;
    }

    if (Array.isArray(value) || isRecord(value)) {
      findings.push(...findUnauthorizedFields(value, fieldPath, args.url));
      continue;
    }

    findings.push({
      fieldName: fieldPath,
      matchPreview: redactPreview(String(value)),
    });
  }

  return findings;
}

function validateObjectWithoutEntityName(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): InternalUnauthorizedFieldFinding[] {
  if (isTopLevelArrayItemPath(args.path)) {
    return validateUrlOnlyObject(args);
  }

  if (args.path !== '') {
    const nestedFindings: InternalUnauthorizedFieldFinding[] = [];

    for (const [key, value] of Object.entries(args.obj)) {
      const fieldPath = args.path ? `${args.path}.${key}` : key;

      if (Array.isArray(value) || isRecord(value)) {
        nestedFindings.push(
          ...findUnauthorizedFields(value, fieldPath, args.url),
        );
      }
    }

    return nestedFindings;
  }

  return validateNumericObject(args);
}

function findUnauthorizedFields(
  obj: unknown,
  path: string = '',
  url: string = '',
): InternalUnauthorizedFieldFinding[] {
  const findings: InternalUnauthorizedFieldFinding[] = [];
  if (!isRecord(obj) && !Array.isArray(obj)) {
    return findings;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      findings.push(...findUnauthorizedFields(item, `${path}[${index}]`, url));
    });
    return findings;
  }

  if (
    path === '' &&
    (FEATURE_FLAG_PATH_REGEX.test(url) || HEALTH_CHECK_PATH_REGEX.test(url))
  ) {
    return validateSystemStatusObject({
      obj,
      path,
      url,
    });
  }

  if (path === '' && DOWNLOAD_URL_PATH_REGEX.test(url)) {
    return validateUrlOnlyObject({
      obj,
      path,
      url,
    });
  }

  const candidateEntityName =
    typeof obj.entityName === 'string' ? obj.entityName : undefined;

  if (!candidateEntityName) {
    return validateObjectWithoutEntityName({
      obj,
      path,
      url,
    });
  }

  const entityMetadata = validateEntityMetadata({
    candidateEntityName,
    path,
  });

  findings.push(...entityMetadata.findings);

  if (entityMetadata.findings.length > 0 && !entityMetadata.allowedFields) {
    return findings;
  }

  for (const [key, value] of Object.entries(obj)) {
    const fieldPath = path ? `${path}.${key}` : key;

    if (
      entityMetadata.allowedFields &&
      !entityMetadata.allowedFields.has(key)
    ) {
      findings.push({
        entityName: candidateEntityName,
        fieldName: fieldPath,
        matchPreview: redactPreview(String(value).slice(0, 50)),
      });
    }

    if (typeof value === 'object' && value !== null) {
      findings.push(...findUnauthorizedFields(value, fieldPath, url));
    }
  }

  return findings;
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
  const bodyFindings = findUnauthorizedFields(args.body, '', args.url);
  args.findings.push(
    ...bodyFindings.map(finding => ({
      ...finding,
      url: args.url,
      method: args.method,
      location: args.location,
    })),
  );
}
