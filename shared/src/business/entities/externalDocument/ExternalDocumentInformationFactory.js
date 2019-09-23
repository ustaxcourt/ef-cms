const joi = require('joi-browser');
const {
  addPropertyHelper,
  makeRequiredHelper,
} = require('./externalDocumentHelpers');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const {
  SecondaryDocumentInformationFactory,
} = require('./SecondaryDocumentInformationFactory');
const {
  SupportingDocumentInformationFactory,
} = require('./SupportingDocumentInformationFactory');
const { includes } = require('lodash');

const VALIDATION_ERROR_MESSAGES = {
  attachments: '#Enter selection for Attachments.',
  category: '#Select a Category.',
  certificateOfService:
    '#Indicate whether you are including a Certificate of Service',
  certificateOfServiceDate: [
    {
      contains: 'must be less than or equal to',
      message:
        '#Certificate of Service date cannot be in the future. Enter a valid date.',
    },
    '#Enter date of service',
  ],
  documentType: '#Select a document type',
  freeText: '#Provide an answer',
  freeText2: '#Provide an answer',
  hasSecondarySupportingDocuments:
    '#Enter selection for Secondary Supporting Documents.',
  hasSupportingDocuments: '#Enter selection for Supporting Documents.',
  objections: '#Enter selection for Objections.',
  ordinalValue: '#Select an iteration',
  partyPrimary: '#Select a filing party',
  partyRespondent: '#Select a filing party',
  partySecondary: '#Select a filing party',
  previousDocument: '#Select a document',
  primaryDocumentFile: '#Upload a document',
  primaryDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `#Your Primary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    '#Your Primary Document file size is empty.',
  ],
  secondaryDocument: '#Select a document',
  secondaryDocumentFile: '#Upload a document',
  secondaryDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `#Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    '#Your Secondary Document file size is empty.',
  ],
  serviceDate: [
    {
      contains: 'must be less than or equal to',
      message: '#Service date cannot be in the future. Enter a valid date.',
    },
    '#Provide a service date',
  ],
  supportingDocument: '#Select a document type',
  supportingDocumentFile: '#Upload a document',
  supportingDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `#Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    '#Your Supporting Document file size is empty.',
  ],
  supportingDocumentFreeText: '#Enter name',
  trialLocation: '#Select a preferred trial location.',
};

/**
 *
 * @constructor
 */
function ExternalDocumentInformationFactory() {}

/**
 *
 * @param {object} documentMetadata the document metadata
 * @returns {Function} the created entity
 */
ExternalDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    this.attachments = rawProps.attachments;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.freeText = rawProps.freeText;
    this.hasSecondarySupportingDocuments =
      rawProps.hasSecondarySupportingDocuments;
    this.hasSupportingDocuments = rawProps.hasSupportingDocuments;
    this.lodged = rawProps.lodged;
    this.objections = rawProps.objections;
    this.ordinalValue = rawProps.ordinalValue;
    this.partyPrimary = rawProps.partyPrimary;
    this.partyRespondent = rawProps.partyRespondent;
    this.partySecondary = rawProps.partySecondary;
    this.previousDocument = rawProps.previousDocument;
    this.primaryDocumentFile = rawProps.primaryDocumentFile;
    this.secondaryDocument = rawProps.secondaryDocument;
    this.secondaryDocumentFile = rawProps.secondaryDocumentFile;
    this.secondarySupportingDocuments = rawProps.secondarySupportingDocuments;
    this.supportingDocuments = rawProps.supportingDocuments;

    if (this.secondaryDocument) {
      this.secondaryDocument = SecondaryDocumentInformationFactory.get(
        {
          ...this.secondaryDocument,
          secondaryDocumentFile: this.secondaryDocumentFile,
        },
        VALIDATION_ERROR_MESSAGES,
      );
    }

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return SupportingDocumentInformationFactory.get(
          item,
          VALIDATION_ERROR_MESSAGES,
        );
      });
    }

    if (this.secondarySupportingDocuments) {
      this.secondarySupportingDocuments = this.secondarySupportingDocuments.map(
        item => {
          return SupportingDocumentInformationFactory.get(
            item,
            VALIDATION_ERROR_MESSAGES,
          );
        },
      );
    }
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    hasSupportingDocuments: joi.boolean().required(),
    primaryDocumentFile: joi.object().required(),
    primaryDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    hasSecondarySupportingDocuments: joi.boolean(),
    objections: joi.string(),
    partyPrimary: joi.boolean(),
    partyRespondent: joi.boolean(),
    partySecondary: joi.boolean(),
    secondaryDocumentFile: joi.object(),
    secondaryDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    secondarySupportingDocuments: joi.array().optional(),
    supportingDocuments: joi.array().optional(),
  };

  let customValidate;

  const addProperty = (itemName, itemSchema, itemErrorMessage) => {
    addPropertyHelper({
      VALIDATION_ERROR_MESSAGES,
      itemErrorMessage,
      itemName,
      itemSchema,
      schema,
    });
  };

  const makeRequired = itemName => {
    makeRequiredHelper({
      itemName,
      schema,
      schemaOptionalItems,
    });
  };

  if (documentMetadata.certificateOfService === true) {
    makeRequired('certificateOfServiceDate');
  }

  if (
    documentMetadata.category === 'Motion' ||
    includes(
      [
        'Motion to Withdraw Counsel',
        'Motion to Withdraw As Counsel',
        'Application to Take Deposition',
      ],
      documentMetadata.documentType,
    )
  ) {
    makeRequired('objections');
  }

  if (documentMetadata.scenario.toLowerCase().trim() === 'nonstandard h') {
    if (
      includes(
        documentMetadata.documentType,
        'Motion for Leave to File Out of Time',
      )
    ) {
      makeRequired('secondaryDocumentFile');
    }

    if (documentMetadata.secondaryDocumentFile) {
      makeRequired('hasSecondarySupportingDocuments');
    }
  }

  if (
    documentMetadata.partyPrimary !== true &&
    documentMetadata.partySecondary !== true &&
    documentMetadata.partyRespondent !== true
  ) {
    addProperty(
      'partyPrimary',
      joi
        .boolean()
        .invalid(false)
        .required(),
    );
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    VALIDATION_ERROR_MESSAGES,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = {
  ExternalDocumentInformationFactory,
  VALIDATION_ERROR_MESSAGES,
};
