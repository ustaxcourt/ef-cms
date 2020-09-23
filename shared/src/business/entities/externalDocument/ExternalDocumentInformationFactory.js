const joi = require('joi');
const {
  addPropertyHelper,
  makeRequiredHelper,
} = require('./externalDocumentHelpers');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  SecondaryDocumentInformationFactory,
} = require('./SecondaryDocumentInformationFactory');
const {
  SupportingDocumentInformationFactory,
} = require('./SupportingDocumentInformationFactory');
const { includes, isEqual, reduce, some, sortBy, values } = require('lodash');

const VALIDATION_ERROR_MESSAGES = {
  attachments: 'Enter selection for Attachments.',
  category: 'Select a Category.',
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
  documentType: [
    {
      contains: 'contains an invalid value',
      message:
        'Proposed Stipulated Decision must be filed separately in each case',
    },
    'Select a document type',
  ],
  freeText: 'Provide an answer',
  freeText2: 'Provide an answer',
  hasSecondarySupportingDocuments:
    'Enter selection for Secondary Supporting Documents.',
  hasSupportingDocuments: 'Enter selection for Supporting Documents.',
  objections: 'Enter selection for Objections.',
  ordinalValue: 'Select an iteration',
  partyIrsPractitioner: 'Select a filing party',
  partyPrimary: 'Select a filing party',
  partySecondary: 'Select a filing party',
  previousDocument: 'Select a document',
  primaryDocumentFile: 'Upload a document',
  primaryDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Primary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Primary Document file size is empty.',
  ],
  secondaryDocument: 'Select a document',
  secondaryDocumentFile: 'Upload a document',
  secondaryDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Secondary Document file size is empty.',
  ],
  serviceDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Service date cannot be in the future. Enter a valid date.',
    },
    'Provide a service date',
  ],
  supportingDocument: 'Select a document type',
  supportingDocumentFile: 'Upload a document',
  supportingDocumentFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Supporting Document file size is empty.',
  ],
  supportingDocumentFreeText: 'Enter name',
  trialLocation: 'Select a preferred trial location.',
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
  let entityConstructor = function (rawProps) {
    this.attachments = rawProps.attachments;
    this.casesParties = rawProps.casesParties;
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
    this.partyIrsPractitioner = rawProps.partyIrsPractitioner;
    this.partySecondary = rawProps.partySecondary;
    this.previousDocument = rawProps.previousDocument;
    this.primaryDocumentFile = rawProps.primaryDocumentFile;
    this.secondaryDocument = rawProps.secondaryDocument;
    this.secondaryDocumentFile = rawProps.secondaryDocumentFile;
    this.secondarySupportingDocuments = rawProps.secondarySupportingDocuments;
    this.selectedCases = rawProps.selectedCases;
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
    casesParties: joi.object().optional(),
    certificateOfService: joi.boolean().required(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).optional(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).optional(),
    freeText: JoiValidationConstants.STRING.optional(),
    hasSupportingDocuments: joi.boolean().required(),
    lodged: joi.boolean().optional(),
    ordinalValue: JoiValidationConstants.STRING.optional(),
    previousDocument: joi.object().optional(),
    primaryDocumentFile: joi.object().required(),
    primaryDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
    hasSecondarySupportingDocuments: joi.boolean(),
    objections: JoiValidationConstants.STRING,
    partyIrsPractitioner: joi.boolean(),
    partyPrimary: joi.boolean(),
    partySecondary: joi.boolean(),
    secondaryDocumentFile: joi.object(),
    secondaryDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    secondarySupportingDocuments: joi.array().optional(),
    selectedCases: joi.array().items(JoiValidationConstants.STRING).optional(),
    supportingDocuments: joi.array().optional(),
  };

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

  const objectionDocumentTypes = [
    ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Motion'].map(entry => {
      return entry.documentType;
    }),
    'Motion to Withdraw Counsel (filed by petitioner)',
    'Motion to Withdraw as Counsel',
    'Application to Take Deposition',
  ];

  if (
    objectionDocumentTypes.includes(documentMetadata.documentType) ||
    (['AMAT', 'ADMT'].includes(documentMetadata.eventCode) &&
      objectionDocumentTypes.includes(
        documentMetadata.previousDocument.documentType,
      ))
  ) {
    makeRequired('objections');
  }

  if (
    documentMetadata.scenario &&
    documentMetadata.scenario.toLowerCase().trim() === 'nonstandard h'
  ) {
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
    documentMetadata.selectedCases &&
    documentMetadata.selectedCases.length > 1
  ) {
    if (documentMetadata.partyIrsPractitioner !== true) {
      const casesWithAPartySelected = reduce(
        documentMetadata.casesParties,
        (accArray, parties, docketNumber) => {
          if (some(values(parties))) {
            accArray.push(docketNumber);
          }
          return accArray;
        },
        [],
      );
      if (
        !isEqual(
          sortBy(documentMetadata.selectedCases),
          sortBy(casesWithAPartySelected),
        )
      ) {
        addProperty('partyPrimary', joi.boolean().invalid(false).required());
      }
    }
  } else {
    if (
      documentMetadata.partyPrimary !== true &&
      documentMetadata.partySecondary !== true &&
      documentMetadata.partyIrsPractitioner !== true
    ) {
      addProperty('partyPrimary', joi.boolean().invalid(false).required());
    }
  }

  joiValidationDecorator(entityConstructor, schema, VALIDATION_ERROR_MESSAGES);

  return new entityConstructor(documentMetadata);
};

module.exports = {
  ExternalDocumentInformationFactory,
  VALIDATION_ERROR_MESSAGES,
};
