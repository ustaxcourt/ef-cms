import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';
import { PublicTrialSessionInfo } from '@shared/business/dto/trialSessions/PublicTrialSessionInfo';
import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { HealthCheckResponse } from '@shared/business/dto/public/HealthCheckResponse';
import { PublicDocumentDownloadUrl } from '@shared/business/dto/public/PublicDocumentDownloadUrl';
import { PublicDocketRecordPdfJobResponse } from '@shared/business/dto/public/PublicDocketRecordPdfJobResponse';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { PublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';

export type UnauthorizedPublicFieldFinding = {
  entityName?: string;
  fieldName: string;
  matchPreview: string;
  type?: 'unauthorized_field' | 'not_validated';
};

const PUBLIC_ENTITY_FACTORIES = {
  PublicCase: (): PublicCase =>
    new PublicCase(
      {},
      {
        authorizedUser: undefined,
      },
    ),
  PublicCaseResponse: (): PublicCaseResponse =>
    new PublicCaseResponse(
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
  PublicTrialSessionInfo: (): PublicTrialSessionInfo =>
    new PublicTrialSessionInfo(new TrialSession({})),
  PublicUser: (): PublicUser => new PublicUser({}),
  RestrictedCase: (): RestrictedCase =>
    new RestrictedCase({ docketNumber: '' }),
  RestrictedCaseResponse: (): RestrictedCaseResponse =>
    new RestrictedCaseResponse(new RestrictedCase({ docketNumber: '' })),
  FeatureFlagResponseDTO: (): FeatureFlagResponseDTO =>
    new FeatureFlagResponseDTO({}),
  HealthCheckResponse: (): HealthCheckResponse =>
    new HealthCheckResponse({
      cognito: false,
      elasticsearch: false,
      emailService: false,
      s3: {
        app: false,
        appFailover: false,
        eastDocuments: false,
        eastTempDocuments: false,
        public: false,
        publicFailover: false,
        westDocuments: false,
        westTempDocuments: false,
      },
    }),
  PublicDocumentDownloadUrl: (): PublicDocumentDownloadUrl =>
    new PublicDocumentDownloadUrl({ url: '' }),
  PublicDocketRecordPdfJobResponse: (): PublicDocketRecordPdfJobResponse =>
    new PublicDocketRecordPdfJobResponse({
      status: 'pending',
      jobId: '',
      url: '',
      message: '',
      statusCode: 200,
    }),
} as const;

const DYNAMIC_ALLOWED_FIELDS_BY_ENTITY_NAME: Map<string, Set<string>> = new Map(
  [
    [
      'FeatureFlagResponseDTO',
      new Set([
        'entityName',
        ...Object.values(ALLOWLIST_FEATURE_FLAGS).map(flag => flag.key),
      ]),
    ],
  ],
);

function extractAllowedFieldsByEntityName(): Map<string, Set<string>> {
  const allowedFieldsByEntityName = new Map<string, Set<string>>();

  for (const [entityName, createEntity] of Object.entries(
    PUBLIC_ENTITY_FACTORIES,
  )) {
    // Use overridden allowed fields if available
    if (DYNAMIC_ALLOWED_FIELDS_BY_ENTITY_NAME.has(entityName)) {
      allowedFieldsByEntityName.set(
        entityName,
        DYNAMIC_ALLOWED_FIELDS_BY_ENTITY_NAME.get(entityName)!,
      );
      continue;
    }

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

  if (args.path === '' && (args.obj as any).isValidated !== true) {
    findings.push({
      entityName: args.candidateEntityName,
      fieldName: args.path ? `${args.path}.isValidated` : 'isValidated',
      matchPreview: '[not validated]',
      type: 'not_validated',
    });
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
