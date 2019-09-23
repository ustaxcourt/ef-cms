const joi = require('joi-browser');
const {
  ExternalDocumentFactory,
} = require('../externalDocument/ExternalDocumentFactory');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const { includes, omit } = require('lodash');

DocketEntryFactory.VALIDATION_ERROR_MESSAGES = {
  attachments: 'Enter selection for Attachments.',
  certificateOfService:
    'Indicate whether you are including a Certificate of Service',
  certificateOfServiceDate: [
    {
      contains: 'must be less than or equal to',
      message:
        'Certificate of Service date cannot be in the future. Enter a valid date.',
    },
    'Enter date of service',
  ],
  dateReceived: [
    {
      contains: 'must be less than or equal to',
      message: 'Received date cannot be in the future. Enter a valid date.',
    },
    'Enter a valid date received',
  ],
  eventCode: 'Select a document type',
  exhibits: 'Enter selection for Exhibits.',
  hasSupportingDocuments: 'Enter selection for Supporting Documents.',
  lodged: 'Enter selection for Filing Status.',
  objections: 'Enter selection for Objections.',
  partyPrimary: 'Select a filing party',
  partyRespondent: 'Select a filing party',
  partySecondary: 'Select a filing party',
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
  let entityConstructor = function(rawPropsParam) {
    this.addToCoversheet = rawPropsParam.addToCoversheet;
    this.additionalInfo = rawPropsParam.additionalInfo;
    this.additionalInfo2 = rawPropsParam.additionalInfo2;
    this.attachments = rawPropsParam.attachments;
    this.certificateOfService = rawPropsParam.certificateOfService;
    this.certificateOfServiceDate = rawPropsParam.certificateOfServiceDate;
    this.dateReceived = rawPropsParam.dateReceived;
    this.documentType = rawPropsParam.documentType;
    this.eventCode = rawPropsParam.eventCode;
    this.exhibits = rawPropsParam.exhibits;
    this.serviceDate = rawPropsParam.serviceDate;
    this.freeText = rawPropsParam.freeText;
    this.hasSupportingDocuments = rawPropsParam.hasSupportingDocuments;
    this.lodged = rawPropsParam.lodged;
    this.objections = rawPropsParam.objections;
    this.ordinalValue = rawPropsParam.ordinalValue;
    this.partyPrimary = rawPropsParam.partyPrimary;
    this.partyRespondent = rawPropsParam.partyRespondent;
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

  let schema = {
    addToCoversheet: joi.boolean(),
    additionalInfo: joi.string(),
    additionalInfo2: joi.string(),
    attachments: joi.boolean(),
    certificateOfService: joi.boolean(),
    dateReceived: joi
      .date()
      .iso()
      .max('now')
      .required(),
    eventCode: joi.string().required(),
    exhibits: joi.boolean(),
    hasSupportingDocuments: joi.boolean(),
    lodged: joi.boolean(),
    primaryDocumentFile: joi.object().optional(),
    primaryDocumentFileSize: joi.when('primaryDocumentFile', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi
        .number()
        .required()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer(),
    }),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now')
      .required(),
    objections: joi.string().required(),
    partyPrimary: joi
      .boolean()
      .invalid(false)
      .required(),
    partyRespondent: joi.boolean().required(),
    partySecondary: joi.boolean().required(),
    secondaryDocumentFile: joi.object().optional(),
  };

  let errorToMessageMap = DocketEntryFactory.VALIDATION_ERROR_MESSAGES;

  let customValidate;

  const addToSchema = itemName => {
    schema[itemName] = schemaOptionalItems[itemName];
  };

  const exDoc = ExternalDocumentFactory.get(rawProps);

  const externalDocumentOmit = ['category'];

  const docketEntryExternalDocumentSchema = omit(
    exDoc.getSchema(),
    externalDocumentOmit,
  );
  schema = { ...schema, ...docketEntryExternalDocumentSchema };

  const docketEntryExternalDocumentErrorToMessageMap = omit(
    exDoc.getErrorToMessageMap(),
    externalDocumentOmit,
  );
  errorToMessageMap = {
    ...errorToMessageMap,
    ...docketEntryExternalDocumentErrorToMessageMap,
  };

  if (rawProps.certificateOfService === true) {
    addToSchema('certificateOfServiceDate');
  }

  if (
    rawProps.category === 'Motion' ||
    includes(
      [
        'Motion to Withdraw Counsel',
        'Motion to Withdraw As Counsel',
        'Application to Take Deposition',
      ],
      rawProps.documentType,
    )
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
    rawProps.partyRespondent !== true
  ) {
    addToSchema('partyPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(rawProps);
}

module.exports = { DocketEntryFactory };
