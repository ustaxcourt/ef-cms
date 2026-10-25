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

export type UnauthorizedPublicFieldFindingCore = {
  entityName?: string;
  fieldName: string;
  matchPreview: string;
};

export type UnauthorizedPublicFieldFinding =
  UnauthorizedPublicFieldFindingCore & {
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
  PublicDocketEntry: (): PublicDocketEntry =>
    new PublicDocketEntry({
      docketNumber: '',
      filingDate: '',
      receivedAt: '',
    }),
  PublicDocumentSearchResult: (): PublicDocumentSearchResult =>
    new PublicDocumentSearchResult({}),
  PublicTrialSessionDetails: (): PublicTrialSessionDetails =>
    new PublicTrialSessionDetails({ startDate: '' }),
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

const isNonNegativeInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;
const isPositiveInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;
const isPrimitiveArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.every(item => typeof item === 'string' || typeof item === 'number');
const isPublicEntityArray =
  (entityName: string): ((value: unknown) => boolean) =>
  (value: unknown): boolean =>
    Array.isArray(value) &&
    value.every(item => isRecord(item) && item.entityName === entityName);
const isPublicDocketEntryArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.every(
    item => isRecord(item) && item.entityName === 'PublicDocketEntry',
  );

type PublicResponseWrapperSchema = {
  fields: Record<string, (value: unknown) => boolean>;
  path: string;
};

const PUBLIC_RESPONSE_WRAPPER_SCHEMAS: PublicResponseWrapperSchema[] = [
  {
    fields: {
      docketEntries: isPublicDocketEntryArray,
      page: isNonNegativeInteger,
      pageSize: isPositiveInteger,
      totalCount: isNonNegativeInteger,
    },
    path: '',
  },
  {
    fields: {
      results: isPublicEntityArray('PublicCaseSearchResult'),
    },
    path: '',
  },
  {
    fields: {
      results: isPublicEntityArray('PublicDocumentSearchResult'),
    },
    path: '',
  },
  {
    fields: {
      results: isPublicEntityArray('PublicDocumentSearchResult'),
      totalCount: isNonNegativeInteger,
    },
    path: '',
  },
  {
    fields: {
      searchResults: isRecord,
    },
    path: '',
  },
  {
    fields: {
      lastKey: isPrimitiveArray,
      practitioners: isPublicEntityArray('PublicContact'),
      total: isNonNegativeInteger,
    },
    path: 'searchResults',
  },
];

type NestedObjectSchema = {
  allowNull?: boolean;
  array?: boolean;
  fields: Record<string, (value: unknown) => boolean>;
  requiredFields?: string[];
};

const isBooleanValue = (value: unknown): boolean => typeof value === 'boolean';
const isStringValue = (value: unknown): boolean => typeof value === 'string';

const NESTED_OBJECT_SCHEMAS_BY_ENTITY_NAME: Record<
  string,
  Record<string, NestedObjectSchema>
> = {
  HealthCheckResponse: {
    s3: {
      fields: {
        app: isBooleanValue,
        appFailover: isBooleanValue,
        eastDocuments: isBooleanValue,
        eastTempDocuments: isBooleanValue,
        public: isBooleanValue,
        publicFailover: isBooleanValue,
        westDocuments: isBooleanValue,
        westTempDocuments: isBooleanValue,
      },
    },
  },
  PublicDocketEntry: {
    affectedByDocketEntries: {
      allowNull: true,
      array: true,
      fields: {
        disposition: isStringValue,
        docketEntryId: isStringValue,
      },
    },
    affectedDocketEntries: {
      allowNull: true,
      array: true,
      fields: {
        disposition: isStringValue,
        docketEntryId: isStringValue,
      },
    },
    previousDocument: {
      fields: {
        docketEntryId: isStringValue,
        documentTitle: isStringValue,
        documentType: isStringValue,
      },
      requiredFields: [],
    },
  },
  PublicTrialSessionInfo: {
    judge: {
      fields: {
        name: isStringValue,
      },
    },
  },
};

function extractAllowedFieldsByEntityName(): Map<string, Set<string>> {
  const allowedFieldsByEntityName = new Map<string, Set<string>>();

  for (const [entityName, createEntity] of Object.entries(
    PUBLIC_ENTITY_FACTORIES,
  )) {
    const dynamicAllowedFields =
      DYNAMIC_ALLOWED_FIELDS_BY_ENTITY_NAME.get(entityName);

    // Use overridden allowed fields if available
    if (dynamicAllowedFields !== undefined) {
      allowedFieldsByEntityName.set(entityName, dynamicAllowedFields);
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

function createInvalidNestedObjectFinding(
  path: string,
): UnauthorizedPublicFieldFinding {
  return {
    fieldName: path,
    matchPreview: '[invalid]',
  };
}

function validateNestedObjectRecord(args: {
  obj: unknown;
  path: string;
  schema: NestedObjectSchema;
}): UnauthorizedPublicFieldFinding[] {
  if (!isRecord(args.obj)) {
    return [createInvalidNestedObjectFinding(args.path)];
  }

  const findings: UnauthorizedPublicFieldFinding[] = [];
  const requiredFields =
    args.schema.requiredFields ?? Object.keys(args.schema.fields);

  for (const requiredField of requiredFields) {
    if (
      !Object.prototype.hasOwnProperty.call(args.obj, requiredField) ||
      args.obj[requiredField] === undefined
    ) {
      findings.push({
        fieldName: `${args.path}.${requiredField}`,
        matchPreview: '[missing]',
      });
    }
  }

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = `${args.path}.${key}`;
    const validateField = Object.hasOwn(args.schema.fields, key)
      ? args.schema.fields[key]
      : undefined;
    const isValidFieldValue =
      validateField && (value === undefined || validateField(value));

    if (!isValidFieldValue) {
      findings.push(createInvalidNestedObjectFinding(fieldPath));
    }
  }

  return findings;
}

function validateNestedObjectValue(args: {
  path: string;
  schema: NestedObjectSchema;
  value: unknown;
}): UnauthorizedPublicFieldFinding[] {
  if (
    args.value === undefined ||
    (args.schema.allowNull && args.value === null)
  ) {
    return [];
  }

  if (!args.schema.array) {
    return validateNestedObjectRecord({
      obj: args.value,
      path: args.path,
      schema: args.schema,
    });
  }

  if (!Array.isArray(args.value)) {
    return [createInvalidNestedObjectFinding(args.path)];
  }

  return args.value.flatMap((item, index) =>
    validateNestedObjectRecord({
      obj: item,
      path: `${args.path}[${index}]`,
      schema: args.schema,
    }),
  );
}

function isUrlOnlyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 1 && typeof obj.url === 'string';
}

function hasApprovedResponseWrapperSchema(
  obj: Record<string, unknown>,
  path: string,
): boolean {
  return PUBLIC_RESPONSE_WRAPPER_SCHEMAS.some(schema => {
    if (schema.path !== path) {
      return false;
    }

    const schemaFields = Object.keys(schema.fields);
    return (
      Object.keys(obj).length === schemaFields.length &&
      schemaFields.every(
        field => Object.hasOwn(obj, field) && schema.fields[field](obj[field]),
      )
    );
  });
}

function validateObjectWithoutEntityName(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  if (isArrayItemPath(args.path) && isUrlOnlyObject(args.obj)) {
    return [];
  }

  const isApprovedResponseWrapper = hasApprovedResponseWrapperSchema(
    args.obj,
    args.path,
  );
  const findings = isApprovedResponseWrapper
    ? []
    : [createMissingEntityNameFinding(args.path)];

  for (const [key, value] of Object.entries(args.obj)) {
    if (Array.isArray(value) || isRecord(value)) {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive({
          data: value,
          path: `${args.path ? `${args.path}.` : ''}${key}`,
          url: args.url,
          isNestedInEntity: false,
        }),
      );
    }
  }

  return findings;
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
  isNestedInEntity: boolean;
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

  const requiresValidation = !args.isNestedInEntity;

  if (requiresValidation && args.obj.isValidated !== true) {
    findings.push({
      entityName: args.candidateEntityName,
      fieldName: args.path ? `${args.path}.isValidated` : 'isValidated',
      matchPreview: '[not validated]',
      type: 'not_validated',
    });
  }

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = args.path ? `${args.path}.${key}` : key;
    const nestedObjectSchema =
      NESTED_OBJECT_SCHEMAS_BY_ENTITY_NAME[args.candidateEntityName]?.[key];

    if (nestedObjectSchema) {
      findings.push(
        ...validateNestedObjectValue({
          path: fieldPath,
          schema: nestedObjectSchema,
          value,
        }),
      );
      continue;
    }

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
        ...findUnauthorizedPublicFieldsRecursive({
          data: value,
          path: fieldPath,
          url: args.url,
          isNestedInEntity: true,
        }),
      );
    }
  }

  return findings;
}

function findUnauthorizedPublicFieldsRecursive({
  data,
  path = '',
  url = '',
  isNestedInEntity = false,
}: {
  data: unknown;
  path?: string;
  url?: string;
  isNestedInEntity?: boolean;
}): UnauthorizedPublicFieldFinding[] {
  const findings: UnauthorizedPublicFieldFinding[] = [];
  if (!isRecord(data) && !Array.isArray(data)) {
    return findings;
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive({
          data: item,
          path: `${path}[${index}]`,
          url,
          isNestedInEntity,
        }),
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
    isNestedInEntity,
    obj: data,
    path,
    url,
  });
}

export function findUnauthorizedPublicFields(args: {
  data: unknown;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  return findUnauthorizedPublicFieldsRecursive({
    data: args.data,
    path: '',
    url: args.url,
  });
}
