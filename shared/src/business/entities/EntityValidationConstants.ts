import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AMICUS_BRIEF_EVENT_CODE,
  AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES,
  AUTOGENERATED_INTERNAL_DOCUMENT_TYPES,
  CASE_STATUS_TYPES,
  CLOSED_CASE_STATUSES,
  CONTACT_TYPES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS,
  OPINION_DOCUMENT_TYPES,
  PARTIES_CODES,
  ROLES,
  SCENARIOS,
  SYSTEM_ROLE,
} from './EntityConstants';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { JoiValidationConstants } from './JoiValidationConstants';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { createEndOfDayISO } from '../utilities/DateHandler';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export const SERVICE_INDICATOR_ERROR = {
  serviceIndicator:
    'You cannot change from paper to electronic service. Select a valid service preference.',
};

export const DOCKET_ENTRY_VALIDATION_RULE_KEYS = {
  action: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('Action taken in response to this Docket Record item.'),
  addToCoversheet: joi.boolean().optional(),
  additionalInfo: JoiValidationConstants.STRING.max(500).optional(),
  additionalInfo2: JoiValidationConstants.STRING.max(500).optional(),
  archived: joi
    .boolean()
    .optional()
    .description(
      'A document that was archived instead of added to the Docket Record.',
    ),
  attachments: joi.boolean().optional(),
  certificateOfService: joi.boolean().optional(),
  certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now').when(
    'certificateOfService',
    {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    },
  ),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the Document was added to the system.',
  ),
  date: JoiValidationConstants.ISO_DATE.optional()
    .allow(null)
    .description(
      'An optional date used when generating a fully concatenated document title.',
    ),
  docketEntryId: JoiValidationConstants.UUID.required().description(
    'System-generated unique ID for the docket entry. If the docket entry is associated with a document in S3, this is also the S3 document key.',
  ),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Docket Number of the associated Case in XXXXX-YY format.',
  ),
  docketNumbers: JoiValidationConstants.STRING.max(500)
    .optional()
    .description(
      'Optional Docket Number text used when generating a fully concatenated document title.',
    ),
  documentContentsId: JoiValidationConstants.UUID.optional().description(
    'The S3 ID containing the text contents of the document.',
  ),
  documentIdBeforeSignature: JoiValidationConstants.UUID.optional().description(
    'The id for the original document that was uploaded.',
  ),
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional().description(
    'The title of this document.',
  ),
  documentType: joi.when('isDraft', {
    is: true,
    otherwise: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .required()
      .description('The type of this document.'),
    then: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .optional()
      .allow(null)
      .description('The type of this document.'),
  }),
  draftOrderState: joi.object().allow(null).optional(),
  editState: JoiValidationConstants.STRING.max(4000)
    .allow(null)
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('JSON representation of the in-progress edit of this item.'),
  entityName: JoiValidationConstants.STRING.valid('DocketEntry').required(),
  eventCode: joi.when('isDraft', {
    is: true,
    otherwise: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).required(),
    then: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
      .optional()
      .allow(null),
  }),
  filedBy: JoiValidationConstants.STRING.max(500)
    .when('documentType', {
      is: JoiValidationConstants.STRING.valid(
        ...EXTERNAL_DOCUMENT_TYPES,
        ...INTERNAL_DOCUMENT_TYPES,
      ),
      otherwise: joi.allow('', null).optional(),
      then: joi.when('documentType', {
        is: JoiValidationConstants.STRING.valid(
          ...AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES,
          ...AUTOGENERATED_INTERNAL_DOCUMENT_TYPES,
        ),
        otherwise: joi.required(),
        then: joi.when('isAutoGenerated', {
          is: false,
          otherwise: joi.allow('', null).optional(),
          then: joi.required(),
        }),
      }),
    })
    .description(
      'The party who filed the document, either the petitioner or respondent on the case.',
    ),
  filedByRole: joi
    .when('isDraft', {
      is: true,
      otherwise: JoiValidationConstants.STRING.valid(
        ...[...Object.values(ROLES), SYSTEM_ROLE],
      ).required(),
      then: joi.optional(),
    })
    .description('The role of the party who filed the document.'),
  filers: joi.when('servedAt', {
    is: joi.exist().not(null),
    otherwise: joi.array().items(JoiValidationConstants.UUID).optional(),
    then: joi.array().required(),
  }),
  filingDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description('Date that this Document was filed.'),
  freeText: JoiValidationConstants.STRING.max(1000).optional(),
  freeText2: JoiValidationConstants.STRING.max(1000).optional(),
  hasOtherFilingParty: joi
    .boolean()
    .optional()
    .description('Whether the document has other filing party.'),
  hasSupportingDocuments: joi.boolean().optional(),
  index: joi
    .number()
    .integer()
    .optional()
    .description('Index of this item in the Docket Record list.'),
  isAutoGenerated: joi
    .boolean()
    .optional()
    .description(
      'A flag that indicates when a document was generated by the system as opposed to being uploaded by a user.',
    ),
  isDraft: joi
    .boolean()
    .optional()
    .description('Whether the document is a draft (not on the docket record).'),
  isFileAttached: joi
    .boolean()
    .optional()
    .description('Has an associated PDF in S3.'),
  isLegacy: joi
    .boolean()
    .when('isLegacySealed', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required().valid(true),
    })
    .description(
      'Indicates whether or not the document belongs to a legacy case that has been migrated to the new system.',
    ),
  isLegacySealed: joi
    .boolean()
    .optional()
    .description(
      'Indicates whether or not the legacy document was sealed prior to being migrated to the new system.',
    ),
  isLegacyServed: joi
    .boolean()
    .optional()
    .description(
      'Indicates whether or not the legacy document was served prior to being migrated to the new system.',
    ),
  isMinuteEntry: joi.boolean().required(),
  isOnDocketRecord: joi.boolean().required(),
  isPaper: joi.boolean().optional(),
  isSealed: joi
    .boolean()
    .when('isLegacySealed', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required().valid(true),
    })
    .description('Indicates whether or not the document is sealed.'),
  isStricken: joi
    .boolean()
    .when('isLegacy', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required(),
    })
    .description('Indicates the item has been removed from the docket record.'),
  judge: JoiValidationConstants.STRING.max(100)
    .allow(null)
    .description('The judge associated with the document.')
    .when('documentType', {
      is: JoiValidationConstants.STRING.valid(
        ...OPINION_DOCUMENT_TYPES.map(t => t.documentType),
      ).required(),
      otherwise: joi.optional(),
      then: joi.required(),
    }),
  judgeUserId: JoiValidationConstants.UUID.optional().description(
    'Unique ID for the associated judge.',
  ),
  lodged: joi
    .boolean()
    .optional()
    .description(
      'A lodged document is awaiting action by the judge to enact or refuse.',
    ),
  mailingDate: JoiValidationConstants.STRING.max(100).optional(),
  numberOfPages: joi.number().integer().optional().allow(null),
  objections: JoiValidationConstants.STRING.valid(
    ...OBJECTIONS_OPTIONS,
  ).optional(),
  ordinalValue: JoiValidationConstants.STRING.optional(),
  otherFilingParty: JoiValidationConstants.STRING.max(100)
    .when('hasOtherFilingParty', {
      is: true,
      otherwise: JoiValidationConstants.STRING.when('eventCode', {
        is: joi.exist().valid(AMICUS_BRIEF_EVENT_CODE),
        otherwise: joi.optional(),
        then: joi.required(),
      }),
      then: joi.required(),
    })
    .description(
      'When someone other than the petitioner or respondent files a document, this is the name of the person who filed that document',
    ),
  otherIteration: joi.optional(),
  partyIrsPractitioner: joi.boolean().optional(),
  pending: joi
    .boolean()
    .optional()
    .description(
      'Determines if the docket entry should be displayed in the Pending Report.',
    ),
  previousDocument: joi
    .object()
    .keys({
      docketEntryId: JoiValidationConstants.UUID.optional().description(
        'The ID of the previous document.',
      ),
      documentTitle:
        JoiValidationConstants.DOCUMENT_TITLE.optional().description(
          'The title of the previous document.',
        ),
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .optional()
        .description('The type of the previous document.'),
    })
    .optional(),
  privatePractitioners: joi // TODO: limit keys
    .array()
    .items({ name: JoiValidationConstants.STRING.max(100).required() })
    .optional()
    .description('Practitioner names to be used to compose the filedBy text.'),
  processingStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCUMENT_PROCESSING_STATUS_OPTIONS),
  ).required(),
  qcAt: JoiValidationConstants.ISO_DATE.optional(),
  qcByUserId: JoiValidationConstants.UUID.optional().allow(null),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
  redactionAcknowledgement: joi.boolean().optional().invalid(false),
  relationship: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCUMENT_RELATIONSHIPS),
  ).optional(),
  scenario: JoiValidationConstants.STRING.valid(...SCENARIOS).optional(),
  sealedTo: JoiValidationConstants.STRING.when('isSealed', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.valid(...Object.values(DOCKET_ENTRY_SEALED_TO_TYPES)).required(),
  }).description("If sealed, the type of users who it's sealed from."),
  secondaryDocument: joi // TODO: limit keys
    .object()
    .keys({
      documentTitle:
        JoiValidationConstants.DOCUMENT_TITLE.optional().description(
          'The title of the secondary document.',
        ),
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .required()
        .description('The type of the secondary document.'),
      eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
        .required()
        .description('The event code of the secondary document.'),
    })
    .when('scenario', {
      is: 'Nonstandard H',
      otherwise: joi.forbidden(),
      then: joi.optional(),
    })
    .description('The secondary document.'),
  servedAt: joi
    .alternatives()
    .conditional('servedParties', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.optional(),
      then: JoiValidationConstants.ISO_DATE.required(),
    })
    .description('When the document is served on the parties.'),
  servedParties: joi
    .array()
    .items({
      email: JoiValidationConstants.EMAIL.optional(),
      name: JoiValidationConstants.STRING.max(100)
        .required()
        .description('The name of a party from a contact, or "IRS"'),
      role: JoiValidationConstants.STRING.valid(...Object.values(ROLES))
        .optional()
        .description('Currently only required for the IRS'),
    })
    .when('servedAt', {
      is: joi.exist().not(null),
      otherwise: joi.optional(),
      then: joi.required(),
    })
    .description('The parties to whom the document has been served.'),
  servedPartiesCode: JoiValidationConstants.STRING.valid(
    ...Object.values(PARTIES_CODES),
  )
    .allow(null)
    .optional()
    .description('Served parties code to override system-computed code.'),
  serviceDate: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .allow(null)
    .description(
      'Used by certificate of service documents to construct the document title.',
    ),
  serviceStamp: JoiValidationConstants.STRING.optional(),
  signedAt: JoiValidationConstants.STRING.max(100)
    .when('isDraft', {
      is: false,
      otherwise: joi.optional().allow(null),
      then: joi.when('eventCode', {
        is: joi.valid(...EVENT_CODES_REQUIRING_SIGNATURE),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    })
    .description('The time at which the document was signed.'),
  signedByUserId: joi
    .when('signedJudgeName', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.UUID.optional().allow(null),
      then: JoiValidationConstants.UUID.required(),
    })
    .description('The id of the user who applied the signature.'),
  signedJudgeName: JoiValidationConstants.STRING.max(100)
    .when('isDraft', {
      is: false,
      otherwise: joi.optional().allow(null),
      then: joi.when('eventCode', {
        is: JoiValidationConstants.STRING.valid(
          ...EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
        ),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    })
    .description('The judge who signed the document.'),
  signedJudgeUserId: JoiValidationConstants.UUID.optional() // Optional for now, but should eventually follow same logic as signedJudgeName
    .allow(null)
    .description('The user id of the judge who signed the document.'),
  strickenAt: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .description('Date that this Docket Record item was stricken.'),
  strickenBy: JoiValidationConstants.STRING.optional(),
  strickenByUserId: JoiValidationConstants.STRING.optional(),
  supportingDocument: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null),
  trialLocation: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description(
      'An optional trial location used when generating a fully concatenated document title.',
    ),
  userId: JoiValidationConstants.UUID.when('isDraft', {
    is: undefined,
    otherwise: joi.optional(),
    then: joi.required(),
  }),
  workItem: joi.object().optional(),
};

const WORK_ITEM_VALIDATION_RULE_KEYS = {
  assigneeId: JoiValidationConstants.UUID.allow(null).optional(),
  assigneeName: JoiValidationConstants.STRING.max(100).allow(null).optional(), // should be a Message entity at some point
  associatedJudge: JoiValidationConstants.STRING.max(100).required(),
  caseIsInProgress: joi.boolean().optional(),
  caseStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(CASE_STATUS_TYPES),
  ).optional(),
  caseTitle: JoiValidationConstants.CASE_CAPTION.optional(),
  completedAt: JoiValidationConstants.ISO_DATE.optional(),
  completedBy: JoiValidationConstants.STRING.max(100).optional().allow(null),
  completedByUserId: JoiValidationConstants.UUID.optional().allow(null),
  completedMessage: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null),
  createdAt: JoiValidationConstants.ISO_DATE.optional(),
  // TODO: validate DocketEntry in WorkItem
  // docketEntry: joi.object().keys(DOCKET_ENTRY_VALIDATION_RULE_KEYS).required(),
  docketEntry: joi.object().required(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  entityName: JoiValidationConstants.STRING.valid('WorkItem').required(),
  hideFromPendingMessages: joi.boolean().optional(),
  highPriority: joi.boolean().optional(),
  inProgress: joi.boolean().optional(),
  isInitializeCase: joi.boolean().optional(),
  isRead: joi.boolean().optional(),
  leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
  section: JoiValidationConstants.STRING.required(),
  sentBy: JoiValidationConstants.STRING.max(100)
    .required()
    .description('The name of the user that sent the WorkItem'),
  sentBySection: JoiValidationConstants.STRING.optional(),
  sentByUserId: JoiValidationConstants.UUID.optional(),
  trialDate: joi.string().optional().allow(null),
  trialLocation: joi.string().optional().allow(null),
  updatedAt: JoiValidationConstants.ISO_DATE.required(),
  workItemId: JoiValidationConstants.UUID.required(),
};

const OUTBOX_ITEM_VALIDATION_RULE_KEYS = {
  caseIsInProgress: joi.boolean().optional(),
  caseStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(CASE_STATUS_TYPES),
  ).optional(),
  caseTitle: JoiValidationConstants.CASE_CAPTION.optional(),
  completedAt: JoiValidationConstants.ISO_DATE.optional(),
  completedBy: JoiValidationConstants.STRING.max(100).optional().allow(null),
  docketEntry: joi.object().required(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  inProgress: joi.boolean().optional(),
  leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
  section: JoiValidationConstants.STRING.required(),
  trialDate: JoiValidationConstants.ISO_DATE.optional().allow(null),
};

export const DATE_RANGE_VALIDATION_RULE_KEYS = {
  endDate: joi.alternatives().conditional('startDate', {
    is: JoiValidationConstants.ISO_DATE.exist().not(null),
    otherwise: JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
      .required()
      .description('The end date search filter must be of valid date format'),
    then: JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
      .min(joi.ref('startDate'))
      .required()
      .description(
        'The end date search filter must be of valid date format and greater than or equal to the start date',
      ),
  }),
  startDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description(
      'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
    ),
};

export const DATE_RANGE_VALIDATION_RULE_KEYS_NEW = {
  endDate: joi
    .alternatives()
    .conditional('startDate', {
      is: JoiValidationConstants.ISO_DATE.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
        .required()
        .description('The end date search filter must be of valid date format'),
      then: JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
        .min(joi.ref('startDate'))
        .required()
        .description(
          'The end date search filter must be of valid date format and greater than or equal to the start date',
        ),
    })
    .messages({
      ...setDefaultErrorMessage('Enter a valid end date.'),
      'any.required': 'Enter an end date.',
      'date.max': 'End date cannot be in the future. Enter a valid date.',
      'date.min':
        'End date cannot be prior to start date. Enter a valid end date.',
    }),
  startDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description(
      'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
    )
    .messages({
      ...setDefaultErrorMessage('Enter a valid start date.'),
      'any.required': 'Enter a start date.',
      'date.max': 'Start date cannot be in the future. Enter a valid date.',
    }),
};

export const DOCKET_ENTRY_VALIDATION_RULES = joi
  .object()
  .keys(DOCKET_ENTRY_VALIDATION_RULE_KEYS);

export const OUTBOX_ITEM_VALIDATION_RULES = joi
  .object()
  .keys(OUTBOX_ITEM_VALIDATION_RULE_KEYS);

export const WORK_ITEM_VALIDATION_RULES = joi
  .object()
  .keys(WORK_ITEM_VALIDATION_RULE_KEYS);

// Case shared rules
export const CASE_CAPTION_RULE =
  JoiValidationConstants.CASE_CAPTION.required().description(
    'The name of the party bringing the case, e.g. "Carol Williams, Petitioner," "Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner," or "Estate of Test Taxpayer, Deceased, Petitioner." This is the first half of the case title.',
  );
export const CASE_DOCKET_NUMBER_RULE =
  JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  );
export const CASE_DOCKET_NUMBER_WITH_SUFFIX_RULE =
  JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  );
export const CASE_IRS_PRACTITIONERS_RULE = joi
  .array()
  .items(IrsPractitioner.VALIDATION_RULES)
  .optional()
  .description(
    'List of IRS practitioners (also known as respondents) associated with the case.',
  );
export const CASE_LEAD_DOCKET_NUMBER_RULE =
  JoiValidationConstants.DOCKET_NUMBER.optional().description(
    'If this case is consolidated, this is the docket number of the lead case. It is the lowest docket number in the consolidated group.',
  );
export const CASE_IS_SEALED_RULE = joi.boolean().optional();
export const CASE_PETITIONERS_RULE = joi
  .array()
  .unique(
    (a, b) =>
      a.contactType === CONTACT_TYPES.intervenor &&
      b.contactType === CONTACT_TYPES.intervenor,
  )
  .required();
export const CASE_PRIVATE_PRACTITIONERS_RULE = joi
  .array()
  .items(PrivatePractitioner.VALIDATION_RULES)
  .optional()
  .description('List of private practitioners associated with the case.');
export const CASE_SORTABLE_DOCKET_NUMBER_RULE = joi
  .number()
  .required()
  .description(
    'A sortable representation of the docket number (auto-generated by constructor).',
  );
export const CASE_STATUS_RULE = joi
  .alternatives()
  .conditional('closedDate', {
    is: joi.exist().not(null),
    otherwise: JoiValidationConstants.STRING.valid(
      ...Object.values(CASE_STATUS_TYPES),
    ).optional(),
    then: JoiValidationConstants.STRING.required().valid(
      ...CLOSED_CASE_STATUSES,
    ),
  })
  .meta({ tags: ['Restricted'] })
  .description('Status of the case.');
