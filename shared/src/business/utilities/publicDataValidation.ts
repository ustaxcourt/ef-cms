import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { PublicTrialSessionInfoDTO } from '@shared/business/dto/trialSessions/PublicTrialSessionInfoDTO';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { PublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';

export type UnauthorizedPublicFieldFinding = {
  entityName?: string;
  fieldName: string;
  matchPreview: string;
};

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
      ).toRawObject(),
    ),
  PublicCaseSearchResult: (): PublicCaseSearchResult =>
    new PublicCaseSearchResult({} as PublicCaseSearchResult),
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

function redactPreview(value: string): string {
  if (value.length <= 8) return '[redacted]';
  return `${value.slice(0, 4)}...[redacted]...${value.slice(-4)}`;
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

function isArrayItemPath(path: string): boolean {
  return /\[\d+\]$/.test(path);
}

function createMissingEntityNameFinding(
  path: string,
): UnauthorizedPublicFieldFinding {
  return {
    fieldName: path ? `${path}.entityName` : 'entityName',
    matchPreview: '[missing]',
  };
}

function validateObjectByFieldRule(args: {
  isAllowed: (key: string, value: unknown) => boolean;
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  const findings: UnauthorizedPublicFieldFinding[] = [];

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = args.path ? `${args.path}.${key}` : key;

    if (args.isAllowed(key, value)) {
      continue;
    }

    if (Array.isArray(value) || isRecord(value)) {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive(value, fieldPath, args.url),
      );
      continue;
    }

    findings.push({
      fieldName: fieldPath,
      matchPreview: redactPreview(String(value)),
    });
  }

  return findings;
}

function validateUrlOnlyObject(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  return validateObjectByFieldRule({
    isAllowed: (key, value) => key === 'url' && typeof value === 'string',
    obj: args.obj,
    path: args.path,
    url: args.url,
  });
}

function validateNumericObject(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
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
}): UnauthorizedPublicFieldFinding[] {
  return validateObjectByFieldRule({
    isAllowed: (_key, value) => isAllowedSystemStatusValue(value),
    obj: args.obj,
    path: args.path,
    url: args.url,
  });
}

function validateObjectWithoutEntityName(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  if (isArrayItemPath(args.path)) {
    const urlOnlyFindings = validateUrlOnlyObject(args);

    if (urlOnlyFindings.length === 0) {
      return [];
    }

    return [createMissingEntityNameFinding(args.path)];
  }

  if (args.path !== '') {
    const nestedFindings: UnauthorizedPublicFieldFinding[] = [];

    for (const [key, value] of Object.entries(args.obj)) {
      const fieldPath = args.path ? `${args.path}.${key}` : key;

      if (Array.isArray(value) || isRecord(value)) {
        nestedFindings.push(
          ...findUnauthorizedPublicFieldsRecursive(value, fieldPath, args.url),
        );
      }
    }

    return nestedFindings;
  }

  return validateNumericObject(args);
}

function validateRootObjectByPath(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] | undefined {
  if (
    args.path === '' &&
    (FEATURE_FLAG_PATH_REGEX.test(args.url) ||
      HEALTH_CHECK_PATH_REGEX.test(args.url))
  ) {
    return validateSystemStatusObject({
      obj: args.obj,
      path: args.path,
      url: args.url,
    });
  }

  if (args.path === '' && DOWNLOAD_URL_PATH_REGEX.test(args.url)) {
    return validateUrlOnlyObject({
      obj: args.obj,
      path: args.path,
      url: args.url,
    });
  }

  return undefined;
}

function validateEntityMetadata(args: {
  path: string;
  candidateEntityName?: string;
}): {
  findings: UnauthorizedPublicFieldFinding[];
  allowedFields?: Set<string>;
} {
  const findings: UnauthorizedPublicFieldFinding[] = [];

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

function findUnauthorizedFieldsForEntity(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
  candidateEntityName: string;
}): UnauthorizedPublicFieldFinding[] {
  const findings: UnauthorizedPublicFieldFinding[] = [];
  const entityMetadata = validateEntityMetadata({
    candidateEntityName: args.candidateEntityName,
    path: args.path,
  });

  findings.push(...entityMetadata.findings);

  if (entityMetadata.findings.length > 0 && !entityMetadata.allowedFields) {
    return findings;
  }

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = args.path ? `${args.path}.${key}` : key;

    if (
      entityMetadata.allowedFields &&
      !entityMetadata.allowedFields.has(key)
    ) {
      findings.push({
        entityName: args.candidateEntityName,
        fieldName: fieldPath,
        matchPreview: redactPreview(String(value).slice(0, 50)),
      });
    }

    if (typeof value === 'object' && value !== null) {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive(value, fieldPath, args.url),
      );
    }
  }

  return findings;
}

function findUnauthorizedPublicFieldsRecursive(
  data: unknown,
  path = '',
  url = '',
): UnauthorizedPublicFieldFinding[] {
  const findings: UnauthorizedPublicFieldFinding[] = [];
  if (!isRecord(data) && !Array.isArray(data)) {
    return findings;
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive(
          item,
          `${path}[${index}]`,
          url,
        ),
      );
    });
    return findings;
  }

  const rootValidationResult = validateRootObjectByPath({
    obj: data,
    path,
    url,
  });
  if (rootValidationResult) {
    return rootValidationResult;
  }

  const candidateEntityName =
    typeof data.entityName === 'string' ? data.entityName : undefined;

  if (!candidateEntityName) {
    return validateObjectWithoutEntityName({
      obj: data,
      path,
      url,
    });
  }

  return findUnauthorizedFieldsForEntity({
    candidateEntityName,
    obj: data,
    path,
    url,
  });
}

export function findUnauthorizedPublicFields(args: {
  data: unknown;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  return findUnauthorizedPublicFieldsRecursive(args.data, '', args.url);
}
