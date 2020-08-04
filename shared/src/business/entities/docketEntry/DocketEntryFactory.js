const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  MAX_FILE_SIZE_MB,
} = require('../EntityConstants');
const {
  ExternalDocumentFactory,
} = require('../externalDocument/ExternalDocumentFactory');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('../externalDocument/ExternalDocumentInformationFactory');

DocketEntryFactory.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  dateReceived: [
    {
      contains: 'must be less than or equal to',
      message: 'Received date cannot be in the future. Enter a valid date.',
    },
    'Enter a valid date received',
  ],
  eventCode: 'Select a document type',
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
  let entityConstructor = function (rawPropsParam) {
    this.addToCoversheet = rawPropsParam.addToCoversheet;
    this.additionalInfo = rawPropsParam.additionalInfo;
    this.additionalInfo2 = rawPropsParam.additionalInfo2;
    this.attachments = rawPropsParam.attachments;
    this.certificateOfService = rawPropsParam.certificateOfService;
    this.certificateOfServiceDate = rawPropsParam.certificateOfServiceDate;
    this.dateReceived = rawPropsParam.dateReceived;
    this.documentType = rawPropsParam.documentType;
    this.isDocumentRequired = rawPropsParam.isDocumentRequired;
    this.eventCode = rawPropsParam.eventCode;
    this.serviceDate = rawPropsParam.serviceDate;
    this.freeText = rawPropsParam.freeText;
    this.hasSupportingDocuments = rawPropsParam.hasSupportingDocuments;
    this.lodged = rawPropsParam.lodged;
    this.objections = rawPropsParam.objections;
    this.hasOtherFilingParty = rawPropsParam.hasOtherFilingParty;
    this.otherFilingParty = rawPropsParam.otherFilingParty;
    this.ordinalValue = rawPropsParam.ordinalValue;
    this.partyPrimary = rawPropsParam.partyPrimary;
    this.trialLocation = rawPropsParam.trialLocation;
    this.partyIrsPractitioner = rawPropsParam.partyIrsPractitioner;
    this.partySecondary = rawPropsParam.partySecondary;
    this.previousDocument = rawPropsParam.previousDocument;
    this.primaryDocumentFile = rawPropsParam.primaryDocumentFile;
    this.primaryDocumentFileSize = rawPropsParam.primaryDocumentFileSize;
    this.secondaryDocumentFile = rawPropsParam.secondaryDocumentFile;

    const { secondaryDocument } = rawPropsParam;
    if (secondaryDocument) {
      this.secondaryDocument = ExternalDocumentFactory.get(secondaryDocument);
    }
  };

  let schema = joi.object().keys({
    addToCoversheet: joi.boolean(),
    additionalInfo: joi.string(),
    additionalInfo2: joi.string(),
    attachments: joi.boolean(),
    certificateOfService: joi.boolean(),
    dateReceived: JoiValidationConstants.ISO_DATE.max('now').required(),
    documentType: joi
      .string()
      .valid(...ALL_DOCUMENT_TYPES)
      .optional(),
    eventCode: joi
      .string()
      .valid(...ALL_EVENT_CODES)
      .required(),
    freeText: joi.string().optional(),
    hasOtherFilingParty: joi.boolean().optional(),
    hasSupportingDocuments: joi.boolean(),
    isDocumentRequired: joi.boolean().optional(),
    lodged: joi.boolean(),
    ordinalValue: joi.string().optional(),
    otherFilingParty: joi
      .string()
      .when('hasOtherFilingParty', {
        is: true,
        otherwise: joi.optional(),
        then: joi.required(),
      })
      .description(
        'When someone other than the petitioner or respondent files a document, this is the name of the person who filed that document',
      ),
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
    serviceDate: JoiValidationConstants.ISO_DATE.max('now').optional(),
    trialLocation: joi.string().optional(),
  });

  let schemaOptionalItems = {
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max(
      'now',
    ).required(),
    objections: joi.string().required(),
    partyIrsPractitioner: joi.boolean().required(),
    partyPrimary: joi.boolean().invalid(false).required(),
    partySecondary: joi.boolean().required(),
    secondaryDocumentFile: joi.object().optional(),
  };

  const addToSchema = itemName => {
    schema = schema.keys({
      [itemName]: schemaOptionalItems[itemName],
    });
  };

  const exDoc = ExternalDocumentFactory.get(rawProps);
  const docketEntryExternalDocumentSchema = exDoc.getSchema();

  schema = schema.concat(docketEntryExternalDocumentSchema).concat(
    joi.object({
      category: joi.string().optional(), // omitting category
    }),
  );

  if (rawProps.certificateOfService === true) {
    addToSchema('certificateOfServiceDate');
  }

  const objectionDocumentTypes = [
    ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  if (
    objectionDocumentTypes.includes(rawProps.documentType) ||
    (['AMAT', 'ADMT'].includes(rawProps.eventCode) &&
      objectionDocumentTypes.includes(rawProps.previousDocument.documentType))
  ) {
    addToSchema('objections');
  }

  if (
    rawProps.scenario &&
    rawProps.scenario.toLowerCase().trim() === 'nonstandard h'
  ) {
    addToSchema('secondaryDocumentFile');
  }

  if (
    rawProps.partyPrimary !== true &&
    rawProps.partySecondary !== true &&
    rawProps.partyIrsPractitioner !== true &&
    rawProps.hasOtherFilingParty !== true
  ) {
    addToSchema('partyPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    DocketEntryFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new entityConstructor(rawProps);
}

module.exports = { DocketEntryFactory };
