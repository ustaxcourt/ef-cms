const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AMENDMENT_EVENT_CODES,
  AMICUS_BRIEF_EVENT_CODE,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  MAX_FILE_SIZE_MB,
} = require('../EntityConstants');
const {
  DOCKET_ENTRY_VALIDATION_RULE_KEYS,
} = require('../EntityValidationConstants');
const {
  ExternalDocumentFactory,
} = require('../externalDocument/ExternalDocumentFactory');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('../externalDocument/ExternalDocumentInformationFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');

DocketEntryFactory.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  dateReceived: [
    {
      contains: 'must be less than or equal to',
      message: 'Received date cannot be in the future. Enter a valid date.',
    },
    'Enter a valid date received',
  ],
  documentTitle:
    'Document title must be 3000 characters or fewer. Update this document title and try again.',
  eventCode: 'Select a document type',
  filers: 'Select a filing party',
  lodged: 'Enter selection for filing status.',
  otherFilingParty: 'Enter other filing party name.',
  primaryDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your document file size is empty.',
  ],
  secondaryDocumentFile: 'A file was not selected.',
};

/**
 * @param {object} rawProps the raw docket entry data
 * @constructor
 */
function DocketEntryFactory(rawProps) {
  /**
   * bare constructor for entity factory
   */
  function entityConstructor() {}

  entityConstructor.prototype.init = function init(rawPropsParam) {
    this.additionalInfo = rawPropsParam.additionalInfo;
    this.additionalInfo2 = rawPropsParam.additionalInfo2;
    this.addToCoversheet = rawPropsParam.addToCoversheet;
    this.attachments = rawPropsParam.attachments;
    this.certificateOfService = rawPropsParam.certificateOfService;
    this.certificateOfServiceDate = rawPropsParam.certificateOfServiceDate;
    this.dateReceived = rawPropsParam.dateReceived;
    this.documentTitle = rawPropsParam.documentTitle;
    this.documentType = rawPropsParam.documentType;
    this.eventCode = rawPropsParam.eventCode;
    this.filers = rawPropsParam.filers;
    this.freeText = rawPropsParam.freeText;
    this.hasOtherFilingParty = rawPropsParam.hasOtherFilingParty;
    this.hasSupportingDocuments = rawPropsParam.hasSupportingDocuments;
    this.isAutoGenerated = rawPropsParam.isAutoGenerated;
    this.isDocumentRequired = rawPropsParam.isDocumentRequired;
    this.lodged = rawPropsParam.lodged;
    this.objections = rawPropsParam.objections;
    this.ordinalValue = rawPropsParam.ordinalValue;
    this.otherFilingParty = rawPropsParam.otherFilingParty;
    this.partyIrsPractitioner = rawPropsParam.partyIrsPractitioner;
    this.partyPrivatePractitioner = rawPropsParam.partyPrivatePractitioner;
    this.previousDocument = rawPropsParam.previousDocument;
    this.primaryDocumentFile = rawPropsParam.primaryDocumentFile;
    this.primaryDocumentFileSize = rawPropsParam.primaryDocumentFileSize;
    this.secondaryDocumentFile = rawPropsParam.secondaryDocumentFile;
    this.serviceDate = rawPropsParam.serviceDate;
    this.trialLocation = rawPropsParam.trialLocation;

    const { secondaryDocument } = rawPropsParam;
    if (secondaryDocument) {
      this.secondaryDocument = ExternalDocumentFactory(secondaryDocument);
    }
  };
  const objectionEventCodes = [
    ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Motion'].map(entry => {
      return entry.eventCode;
    }),
    'M116',
    'M112',
    'APLD',
  ];

  let schema = joi.object().keys({
    addToCoversheet: DOCKET_ENTRY_VALIDATION_RULE_KEYS.addToCoversheet,
    additionalInfo: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo,
    additionalInfo2: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo2,
    attachments: DOCKET_ENTRY_VALIDATION_RULE_KEYS.attachments,
    certificateOfService:
      DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfService,
    certificateOfServiceDate:
      DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfServiceDate,
    dateReceived: JoiValidationConstants.ISO_DATE.max('now').required(),
    documentTitle: DOCKET_ENTRY_VALIDATION_RULE_KEYS.documentTitle,
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).optional(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).required(),
    freeText: DOCKET_ENTRY_VALIDATION_RULE_KEYS.freeText,
    hasOtherFilingParty: DOCKET_ENTRY_VALIDATION_RULE_KEYS.hasOtherFilingParty,
    hasSupportingDocuments:
      DOCKET_ENTRY_VALIDATION_RULE_KEYS.hasSupportingDocuments,
    isAutoGenerated: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isAutoGenerated,
    isDocumentRequired: joi.boolean().optional(),
    lodged: DOCKET_ENTRY_VALIDATION_RULE_KEYS.lodged,
    objections: JoiValidationConstants.STRING.when('eventCode', {
      is: joi.exist().valid(...objectionEventCodes),
      otherwise: joi.when('eventCode', {
        is: joi.exist().valid(...AMENDMENT_EVENT_CODES),
        otherwise: joi.optional(),
        then: joi.when('previousDocument.eventCode', {
          is: joi.exist().valid(...objectionEventCodes),
          otherwise: joi.optional(),
          then: joi.required(),
        }),
      }),
      then: joi.required(),
    }),
    ordinalValue: DOCKET_ENTRY_VALIDATION_RULE_KEYS.ordinalValue,
    otherFilingParty: DOCKET_ENTRY_VALIDATION_RULE_KEYS.otherFilingParty,
    previousDocument: joi.object().optional(),
    primaryDocumentFile: joi.object().when('isDocumentRequired', {
      is: true,
      otherwise: joi.optional(),
      then: joi.required(),
    }),
    primaryDocumentFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
      'primaryDocumentFile',
      {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    serviceDate: DOCKET_ENTRY_VALIDATION_RULE_KEYS.serviceDate,
    trialLocation: DOCKET_ENTRY_VALIDATION_RULE_KEYS.trialLocation,
  });

  const schemaOptionalItems = {
    filers: joi.when('eventCode', {
      is: joi.exist().valid(AMICUS_BRIEF_EVENT_CODE),
      otherwise: joi
        .array()
        .items(JoiValidationConstants.UUID.required())
        .required(),
      then: joi.optional(),
    }),
  };

  const addToSchema = itemName => {
    schema = schema.keys({
      [itemName]: schemaOptionalItems[itemName],
    });
  };

  const exDoc = ExternalDocumentFactory(rawProps);
  const docketEntryExternalDocumentSchema = exDoc.getSchema();

  schema = schema.concat(docketEntryExternalDocumentSchema).concat(
    joi.object({
      category: JoiValidationConstants.STRING.optional(), // omitting category
    }),
  );

  if (
    rawProps.filers?.length === 0 &&
    rawProps.partyIrsPractitioner !== true &&
    rawProps.partyPrivatePractitioner !== true &&
    rawProps.hasOtherFilingParty !== true &&
    !rawProps.isAutoGenerated
  ) {
    addToSchema('filers');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    DocketEntryFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(rawProps);
}

module.exports = { DocketEntryFactory };
