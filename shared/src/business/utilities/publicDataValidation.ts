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
import {
  PublicDocketEntry,
  PublicDocketEntryReference,
} from '@shared/business/entities/cases/PublicDocketEntry';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  PublicCaseSearchResponse,
  PublicDocketEntriesPageResponse,
  PublicDocumentSearchPageResponse,
  PublicDocumentSearchResponse,
  PublicPractitionerSearchResponse,
  PublicPractitionerSearchResults,
} from '@shared/business/dto/public/PublicResponseWrappers';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

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
    new PublicCaseSearchResult({
      caseCaption: '',
      docketNumber: '',
      docketNumberWithSuffix: '',
      petitionerNames: [],
      petitionerStateNames: [],
      receivedAt: '',
    }),
  PublicContact: (): PublicContact => new PublicContact({}),
  PublicDocketEntry: (): PublicDocketEntry =>
    new PublicDocketEntry({
      docketNumber: '',
      filingDate: '',
      receivedAt: '',
    }),
  DocketEntry: (): PublicDocketEntryReference =>
    new PublicDocketEntryReference({}),
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

type PublicResponseWrapperSchema = {
  schema: joi.AnySchema;
  path: string;
};

const PUBLIC_RESPONSE_WRAPPER_SCHEMAS: PublicResponseWrapperSchema[] = [
  {
    schema: getEntityValidationSchema(new PublicDocketEntriesPageResponse()),
    path: '',
  },
  {
    schema: getEntityValidationSchema(new PublicCaseSearchResponse()),
    path: '',
  },
  {
    schema: getEntityValidationSchema(new PublicDocumentSearchResponse()),
    path: '',
  },
  {
    schema: getEntityValidationSchema(new PublicDocumentSearchPageResponse()),
    path: '',
  },
  {
    schema: getEntityValidationSchema(new PublicPractitionerSearchResponse()),
    path: '',
  },
  {
    schema: getEntityValidationSchema(new PublicPractitionerSearchResults()),
    path: 'searchResults',
  },
];

type PublicEntityValidationMetadata = {
  allowedFields: Set<string>;
  schema: joi.AnySchema;
};

function getEntityValidationSchema(entity: JoiValidationEntity): joi.AnySchema {
  const validationRules = entity.getValidationRules();

  return joi.isSchema(validationRules)
    ? validationRules
    : joi.object(validationRules);
}

function getPublicCaseResponseValidationSchema(
  entity: JoiValidationEntity,
): joi.AnySchema {
  return getEntityValidationSchema(entity)
    .fork('consolidatedCases', fieldSchema => fieldSchema.forbidden())
    .fork(['irsPractitioners', 'privatePractitioners'], () =>
      joi.array().items(PublicContact.VALIDATION_RULES).optional(),
    );
}

function getSchemaFields(schema: joi.AnySchema): string[] {
  const description = schema.describe();
  return Object.keys(description.keys ?? {});
}

function getFieldValidationSchema(
  schema: joi.AnySchema,
  fieldName: string,
): joi.AnySchema | undefined {
  if (!getSchemaFields(schema).includes(fieldName)) {
    return undefined;
  }

  return schema.extract(fieldName);
}

function schemaContainsEntityNameField(schema: joi.AnySchema): boolean {
  const containsEntityName = (description: unknown): boolean => {
    if (Array.isArray(description)) {
      return description.some(containsEntityName);
    }

    if (!isRecord(description)) {
      return false;
    }

    if (
      isRecord(description.keys) &&
      Object.hasOwn(description.keys, 'entityName')
    ) {
      return true;
    }

    return Object.values(description).some(containsEntityName);
  };

  return containsEntityName(schema.describe());
}

function extractPublicEntityValidationMetadata(): Map<
  string,
  PublicEntityValidationMetadata
> {
  const validationMetadataByEntityName = new Map<
    string,
    PublicEntityValidationMetadata
  >();

  for (const [entityName, createEntity] of Object.entries(
    PUBLIC_ENTITY_FACTORIES,
  )) {
    const entity = createEntity();
    const schema =
      entityName === 'PublicCaseResponse'
        ? getPublicCaseResponseValidationSchema(entity)
        : getEntityValidationSchema(entity);
    const allowedFields = new Set<string>(getSchemaFields(schema));
    allowedFields.add('entityName');
    validationMetadataByEntityName.set(entityName, {
      allowedFields,
      schema,
    });
  }

  return validationMetadataByEntityName;
}

const PUBLIC_ENTITY_VALIDATION_METADATA =
  extractPublicEntityValidationMetadata();

function redactPreview(value: string): string {
  if (value.length <= 8) return '[redacted]';
  return `${value.slice(0, 4)}...[redacted]...${value.slice(-4)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isApprovedBooleanResponse(args: {
  method?: string;
  url: string;
}): boolean {
  const { pathname } = new URL(args.url, 'http://localhost');

  return (
    pathname === '/public-api/maintenance-mode' ||
    (args.method?.toUpperCase() === 'HEAD' &&
      /^\/public-api\/cases\/[^/]+$/.test(pathname))
  );
}

function createInvalidResponseValueFinding(
  path: string,
): UnauthorizedPublicFieldFinding {
  return {
    fieldName: path || 'response',
    matchPreview: '[invalid]',
  };
}

function createMissingEntityNameFinding(
  path: string,
): UnauthorizedPublicFieldFinding {
  return {
    fieldName: path ? `${path}.entityName` : 'entityName',
    matchPreview: '[missing]',
  };
}

function formatValidationPath(
  basePath: string,
  relativePath: (string | number)[],
): string {
  return relativePath.reduce<string>((formattedPath, segment) => {
    if (typeof segment === 'number') {
      return `${formattedPath}[${segment}]`;
    }

    return formattedPath ? `${formattedPath}.${segment}` : segment;
  }, basePath);
}

function validateValueWithSchema(args: {
  allowUnknown?: boolean;
  path: string;
  schema: joi.AnySchema;
  value: unknown;
}): UnauthorizedPublicFieldFinding[] {
  const { error } = args.schema.validate(args.value, {
    abortEarly: false,
    allowUnknown: args.allowUnknown,
    convert: true,
  });

  if (!error) {
    return [];
  }

  return error.details.map(detail => ({
    fieldName: formatValidationPath(args.path, detail.path),
    matchPreview: detail.type === 'any.required' ? '[missing]' : '[invalid]',
  }));
}

function validateTrialSessionCaseResponses(args: {
  cases: unknown[];
  path: string;
}): UnauthorizedPublicFieldFinding[] {
  const allowedEntityNames = new Set([
    'PublicCaseResponse',
    'RestrictedCaseResponse',
  ]);
  const findings: UnauthorizedPublicFieldFinding[] = [];

  args.cases.forEach((caseResponse, index) => {
    const casePath = formatValidationPath(args.path, [
      'calendaredCases',
      index,
    ]);

    if (!isRecord(caseResponse)) {
      findings.push(createInvalidResponseValueFinding(casePath));
      return;
    }

    const caseEntityName = caseResponse.entityName;
    if (typeof caseEntityName !== 'string') {
      return;
    }

    if (!allowedEntityNames.has(caseEntityName)) {
      findings.push({
        fieldName: `${casePath}.entityName`,
        matchPreview: '[invalid]',
      });
      return;
    }

    const validationMetadata =
      PUBLIC_ENTITY_VALIDATION_METADATA.get(caseEntityName);
    if (!validationMetadata) {
      findings.push({
        fieldName: `${casePath}.entityName`,
        matchPreview: '[invalid]',
      });
      return;
    }

    const { error } = validationMetadata.schema.validate(
      removeKnownEntityMetadata(caseResponse),
      { abortEarly: false, convert: true },
    );

    error?.details
      .filter(detail => detail.path[detail.path.length - 1] !== 'entityName')
      .forEach(detail => {
        findings.push({
          entityName: caseEntityName,
          fieldName: formatValidationPath(casePath, detail.path),
          matchPreview:
            detail.type === 'any.required' ? '[missing]' : '[invalid]',
        });
      });
  });

  return findings;
}

function validateEntityFieldValue(args: {
  candidateEntityName: string;
  entity: Record<string, unknown>;
  fieldName: string;
  path: string;
  schema: joi.AnySchema;
}): UnauthorizedPublicFieldFinding[] {
  if (
    args.candidateEntityName === 'PublicTrialSessionDetails' &&
    args.fieldName === 'calendaredCases' &&
    Array.isArray(args.entity.calendaredCases)
  ) {
    // The Joi copy omits metadata; validate cases by schema, then check original tags recursively.
    return validateTrialSessionCaseResponses({
      cases: args.entity.calendaredCases,
      path: args.path,
    });
  }

  const validationEntity = removeKnownEntityMetadata(args.entity);
  const { error } = args.schema.validate(validationEntity, {
    abortEarly: false,
    convert: true,
  });

  if (!error) {
    return [];
  }

  return error.details
    .filter(
      detail =>
        detail.path[0] === args.fieldName &&
        detail.path[detail.path.length - 1] !== 'entityName',
    )
    .map(detail => ({
      entityName: args.candidateEntityName,
      fieldName: formatValidationPath(args.path, detail.path),
      matchPreview: detail.type === 'any.required' ? '[missing]' : '[invalid]',
    }));
}

function removeKnownEntityMetadata(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeKnownEntityMetadata);
  }

  if (!isRecord(value)) {
    return value;
  }

  const isKnownEntity =
    typeof value.entityName === 'string' &&
    PUBLIC_ENTITY_VALIDATION_METADATA.has(value.entityName);
  const validationEntity: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    if (isKnownEntity && (key === 'entityName' || key === 'isValidated')) {
      continue;
    }

    validationEntity[key] = removeKnownEntityMetadata(nestedValue);
  }

  return validationEntity;
}

function getApprovedResponseWrapperSchema(
  obj: Record<string, unknown>,
  path: string,
): PublicResponseWrapperSchema | undefined {
  const matchingSchemas = PUBLIC_RESPONSE_WRAPPER_SCHEMAS.filter(schema => {
    if (schema.path !== path) {
      return false;
    }

    const schemaFields = getSchemaFields(schema.schema);
    return (
      Object.keys(obj).length === schemaFields.length &&
      schemaFields.every(field => Object.hasOwn(obj, field))
    );
  });

  return (
    matchingSchemas.find(
      ({ schema }) =>
        schema.validate(obj, { abortEarly: false, convert: true }).error ===
        undefined,
    ) ?? matchingSchemas[0]
  );
}

function validateObjectWithoutEntityName(args: {
  obj: Record<string, unknown>;
  path: string;
  url: string;
  method?: string;
}): UnauthorizedPublicFieldFinding[] {
  const responseWrapperSchema = getApprovedResponseWrapperSchema(
    args.obj,
    args.path,
  );
  const findings = responseWrapperSchema
    ? []
    : [createMissingEntityNameFinding(args.path)];

  for (const [key, value] of Object.entries(args.obj)) {
    const fieldPath = `${args.path ? `${args.path}.` : ''}${key}`;
    const fieldSchema = responseWrapperSchema
      ? getFieldValidationSchema(responseWrapperSchema.schema, key)
      : undefined;

    if (Array.isArray(value) || isRecord(value)) {
      if (fieldSchema) {
        findings.push(
          ...validateValueWithSchema({
            path: fieldPath,
            schema: fieldSchema,
            value,
          }),
        );
      }

      const containsObjects = Array.isArray(value)
        ? value.some(item => isRecord(item) || Array.isArray(item))
        : true;

      if (!containsObjects) {
        continue;
      }

      findings.push(
        ...findUnauthorizedPublicFieldsRecursive({
          data: value,
          path: fieldPath,
          url: args.url,
          method: args.method,
          isNestedInEntity: false,
        }),
      );
    }
  }

  return findings;
}

function validateEntityMetadata(args: {
  path: string;
  candidateEntityName: string;
}): {
  findings: UnauthorizedPublicFieldFinding[];
  allowedFields?: Set<string>;
  schema?: joi.AnySchema;
} {
  const findings: UnauthorizedPublicFieldFinding[] = [];

  const validationMetadata = PUBLIC_ENTITY_VALIDATION_METADATA.get(
    args.candidateEntityName,
  );

  if (!validationMetadata) {
    findings.push({
      entityName: args.candidateEntityName,
      fieldName: args.path || 'entityName',
      matchPreview: redactPreview(args.candidateEntityName),
    });
  }

  return {
    allowedFields: validationMetadata?.allowedFields,
    findings,
    schema: validationMetadata?.schema,
  };
}

function containsEntityTaggedValue(value: unknown): boolean {
  if (isRecord(value)) {
    return typeof value.entityName === 'string';
  }

  return (
    Array.isArray(value) &&
    value.some(item => isRecord(item) && typeof item.entityName === 'string')
  );
}

function findUnauthorizedFieldsForEntity(args: {
  isNestedInEntity: boolean;
  obj: Record<string, unknown>;
  path: string;
  url: string;
  method?: string;
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

    if (value === null || typeof value !== 'object' || !entityMetadata.schema) {
      continue;
    }

    const fieldSchema = getFieldValidationSchema(entityMetadata.schema, key);
    const containsNestedEntity = containsEntityTaggedValue(value);

    if (fieldSchema) {
      findings.push(
        ...validateEntityFieldValue({
          candidateEntityName: args.candidateEntityName,
          entity: args.obj,
          fieldName: key,
          path: args.path,
          schema: entityMetadata.schema,
        }),
      );
    }

    if (
      containsNestedEntity ||
      !fieldSchema ||
      schemaContainsEntityNameField(fieldSchema)
    ) {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive({
          data: value,
          path: fieldPath,
          url: args.url,
          method: args.method,
          isNestedInEntity: true,
        }),
      );
    }
  }

  return findings;
}

function findUnauthorizedPublicFieldsRecursive({
  data,
  path,
  url,
  method,
  isNestedInEntity = false,
}: {
  data: unknown;
  path: string;
  url: string;
  method?: string;
  isNestedInEntity?: boolean;
}): UnauthorizedPublicFieldFinding[] {
  const findings: UnauthorizedPublicFieldFinding[] = [];

  if (data === undefined && path === '') {
    return findings;
  }

  if (!isRecord(data) && !Array.isArray(data)) {
    if (
      path === '' &&
      typeof data === 'boolean' &&
      isApprovedBooleanResponse({ method, url })
    ) {
      return findings;
    }

    return [createInvalidResponseValueFinding(path)];
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      findings.push(
        ...findUnauthorizedPublicFieldsRecursive({
          data: item,
          path: `${path}[${index}]`,
          url,
          method,
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
      method,
    });
  }

  return findUnauthorizedFieldsForEntity({
    candidateEntityName,
    isNestedInEntity,
    obj: data,
    path,
    url,
    method,
  });
}

export function findUnauthorizedPublicFields(args: {
  data: unknown;
  method?: string;
  url: string;
}): UnauthorizedPublicFieldFinding[] {
  return findUnauthorizedPublicFieldsRecursive({
    data: args.data,
    path: '',
    url: args.url,
    method: args.method,
  });
}
