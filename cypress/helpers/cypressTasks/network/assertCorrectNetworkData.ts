import { CapturedNetworkPayload } from '../../../local-only/support/commands';
import { PublicCase } from '../../../../shared/src/business/entities/cases/PublicCase';
import { PublicDocketEntry } from '../../../../shared/src/business/entities/cases/PublicDocketEntry';
import { PublicContact } from '../../../../shared/src/business/entities/cases/PublicContact';
import { RestrictedCase } from '../../../../shared/src/business/entities/cases/RestrictedCase';
import { PublicUser } from '../../../../shared/src/business/entities/PublicUser';
import { PublicDocumentSearchResult } from '../../../../shared/src/business/entities/documents/PublicDocumentSearchResult';
import { PublicCaseDTO } from '../../../../shared/src/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '../../../../shared/src/business/dto/cases/RestrictedCaseDTO';

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

const PUBLIC_ENTITY_FACTORIES = {
  PublicCase: (): PublicCase =>
    new PublicCase(
      {},
      {
        authorizedUser: undefined,
      },
    ),
  PublicContact: (): PublicContact => new PublicContact({}),
  PublicDocketEntry: (): PublicDocketEntry => new PublicDocketEntry({}),
  PublicDocumentSearchResult: (): PublicDocumentSearchResult =>
    new PublicDocumentSearchResult({}),
  RestrictedCase: (): RestrictedCase =>
    new RestrictedCase({ docketNumber: '' }),
  PublicUser: (): PublicUser => new PublicUser({}),
} as const;

const DTO_ENTITY_FACTORIES = {
  PublicCaseDTO: (): PublicCaseDTO =>
    new PublicCaseDTO(PUBLIC_ENTITY_FACTORIES.PublicCase().toRawObject()),
  RestrictedCaseDTO: (): RestrictedCaseDTO =>
    new RestrictedCaseDTO(
      PUBLIC_ENTITY_FACTORIES.RestrictedCase().toRawObject(),
    ),
} as const;

const ALLOWED_ENTITY_FACTORIES = {
  ...PUBLIC_ENTITY_FACTORIES,
  ...DTO_ENTITY_FACTORIES,
} as const;

function extractAllowedFieldsByEntityName(): Map<string, Set<string>> {
  const allowedFieldsByEntityName = new Map<string, Set<string>>();

  for (const [entityName, createEntity] of Object.entries(
    ALLOWED_ENTITY_FACTORIES,
  )) {
    const instance = createEntity();
    const allowedFields = new Set<string>(Object.keys(instance));
    allowedFields.add('entityName');
    allowedFieldsByEntityName.set(entityName, allowedFields);
  }

  return allowedFieldsByEntityName;
}

const ALLOWED_FIELDS_BY_ENTITY_NAME = extractAllowedFieldsByEntityName();

function getHeaderValue(
  headers: Record<string, unknown> | undefined,
  headerName: string,
): string | undefined {
  if (!headers) {
    return undefined;
  }

  const directValue = headers[headerName];
  if (typeof directValue === 'string') {
    return directValue;
  }

  const normalizedHeaderName = headerName.toLowerCase();
  const matchingKey = Object.keys(headers).find(
    key => key.toLowerCase() === normalizedHeaderName,
  );

  if (!matchingKey) {
    return undefined;
  }

  const matchingValue = headers[matchingKey];
  return typeof matchingValue === 'string' ? matchingValue : undefined;
}

function shouldValidateResponseBody(payload: CapturedNetworkPayload): boolean {
  if (!payload.responseBody) {
    return false;
  }

  if (NON_API_ASSET_PATH_REGEX.test(payload.url)) {
    return false;
  }

  const contentType = getHeaderValue(payload.responseHeaders, 'content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return false;
  }

  return isRecord(payload.responseBody) || Array.isArray(payload.responseBody);
}

function shouldValidateRequestBody(payload: CapturedNetworkPayload): boolean {
  if (!payload.requestBody) {
    return false;
  }

  const contentType = getHeaderValue(payload.requestHeaders, 'content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    return false;
  }

  return isRecord(payload.requestBody) || Array.isArray(payload.requestBody);
}

function redactPreview(value: string): string {
  if (value.length <= 8) return '[redacted]';
  return `${value.slice(0, 4)}...[redacted]...${value.slice(-4)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getEntityName(value: Record<string, unknown>): string | undefined {
  const candidateEntityName = value.entityName;
  return typeof candidateEntityName === 'string'
    ? candidateEntityName
    : undefined;
}

function isNumericValue(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
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
}): InternalUnauthorizedFieldFinding[] {
  const findings: InternalUnauthorizedFieldFinding[] = [];

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = args.path ? `${args.path}.${key}` : key;

    if (isNumericValue(value)) {
      continue;
    }

    if (Array.isArray(value) || isRecord(value)) {
      findings.push(...findUnauthorizedFields(value, fieldPath));
      continue;
    }

    findings.push({
      fieldName: fieldPath,
      matchPreview: redactPreview(String(value)),
    });
  }

  return findings;
}

function findUnauthorizedFields(
  obj: unknown,
  path: string = '',
): InternalUnauthorizedFieldFinding[] {
  const findings: InternalUnauthorizedFieldFinding[] = [];

  if (!isRecord(obj) && !Array.isArray(obj)) {
    return findings;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      findings.push(...findUnauthorizedFields(item, `${path}[${index}]`));
    });
    return findings;
  }

  const candidateEntityName = getEntityName(obj);

  if (!candidateEntityName) {
    return validateNumericObject({
      obj,
      path,
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
      findings.push(...findUnauthorizedFields(value, fieldPath));
    }
  }

  return findings;
}

export function assertCorrectNetworkData(
  payloads: CapturedNetworkPayload[],
): PublicDataValidationResult {
  const findings: UnauthorizedFieldFinding[] = [];

  for (const payload of payloads) {
    if (shouldValidateResponseBody(payload)) {
      const bodyFindings = findUnauthorizedFields(payload.responseBody);
      findings.push(
        ...bodyFindings.map(finding => ({
          ...finding,
          url: payload.url,
          method: payload.method,
          location: 'responseBody',
        })),
      );
    }

    if (shouldValidateRequestBody(payload)) {
      const bodyFindings = findUnauthorizedFields(payload.requestBody);
      findings.push(
        ...bodyFindings.map(finding => ({
          ...finding,
          url: payload.url,
          method: payload.method,
          location: 'requestBody',
        })),
      );
    }
  }

  return {
    passed: findings.length === 0,
    findings,
  };
}
