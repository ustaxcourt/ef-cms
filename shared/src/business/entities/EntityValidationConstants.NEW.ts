import joi from 'joi';

import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AMICUS_BRIEF_EVENT_CODE,
  AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES,
  AUTOGENERATED_INTERNAL_DOCUMENT_TYPES,
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
import { JoiValidationConstants } from './JoiValidationConstants';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

export const DOCKET_ENTRY_VALIDATION_RULE_KEYS_NEW = {
  action: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('Action taken in response to this Docket Record item.'),
  addToCoversheet: joi.boolean().optional(),
  additionalInfo: JoiValidationConstants.STRING.max(500).optional().messages({
    'string.max': 'Limit is 500 characters. Enter 500 or fewer characters.',
  }),
  additionalInfo2: JoiValidationConstants.STRING.max(500).optional().messages({
    'string.max': 'Limit is 500 characters. Enter 500 or fewer characters.',
  }),
  archived: joi
    .boolean()
    .optional()
    .description(
      'A document that was archived instead of added to the Docket Record.',
    ),
  attachments: joi
    .boolean()
    .optional()
    .messages(setDefaultErrorMessages('Enter selection for Attachments.')),
  certificateOfService: joi
    .boolean()
    .optional()
    .messages(
      setDefaultErrorMessages(
        'Indicate whether you are including a Certificate of Service',
      ),
    ),
  certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now')
    .when('certificateOfService', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .messages({
      ...setDefaultErrorMessages('Enter date of service'),
      'date.max':
        'Certificate of Service date cannot be in the future. Enter a valid date.',
    }),
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
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional()
    .description('The title of this document.')
    .messages(
      setDefaultErrorMessages(
        'Document title must be 3000 characters or fewer. Update this document title and try again.',
      ),
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
    )
    .messages({
      ...setDefaultErrorMessages('Enter a filed by'),
      'string.max': 'Limit is 500 characters. Enter 500 or fewer characters.',
    }),
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
  freeText: JoiValidationConstants.STRING.max(1000).optional().messages({
    'any.required': 'Provide an answer',
    'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
  }),
  freeText2: JoiValidationConstants.STRING.max(1000).optional(),
  hasOtherFilingParty: joi
    .boolean()
    .optional()
    .description('Whether the document has other filing party.'),
  hasSupportingDocuments: joi
    .boolean()
    .optional()
    .messages(
      setDefaultErrorMessages('Enter selection for Supporting Documents.'),
    ),
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
    )
    .messages(setDefaultErrorMessages('Enter selection for filing status.')),
  mailingDate: JoiValidationConstants.STRING.max(100).optional(),
  numberOfPages: joi.number().integer().optional().allow(null),
  objections: JoiValidationConstants.STRING.valid(
    ...OBJECTIONS_OPTIONS,
  ).optional(),
  ordinalValue: JoiValidationConstants.STRING.optional().messages(
    setDefaultErrorMessages('Select an iteration'),
  ),
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
    )
    .messages(setDefaultErrorMessages('Enter other filing party name.')),
  otherIteration: joi.optional().messages({
    ...setDefaultErrorMessages('Maximum iteration value is 999.'),
    'any.required': 'Enter an iteration number.',
  }),
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
  privatePractitioners: joi
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
    )
    .messages(setDefaultErrorMessages('Select a preferred trial location.')),
  userId: JoiValidationConstants.UUID.when('isDraft', {
    is: undefined,
    otherwise: joi.optional(),
    then: joi.required(),
  }),
  workItem: joi.object().optional(),
};

export const DOCKET_ENTRY_VALIDATION_RULES_NEW = joi
  .object()
  .keys(DOCKET_ENTRY_VALIDATION_RULE_KEYS_NEW);
