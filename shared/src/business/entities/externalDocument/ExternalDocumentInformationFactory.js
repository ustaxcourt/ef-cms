const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const {
  SupportingDocumentInformationFactory,
} = require('./SupportingDocumentInformationFactory');
const { includes } = require('lodash');

/**
 *
 * @constructor
 */
function ExternalDocumentInformationFactory() {}

/**
 *
 * @param documentMetadata
 */
ExternalDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, {
      attachments: rawProps.attachments,
      certificateOfService: rawProps.certificateOfService,
      certificateOfServiceDate: rawProps.certificateOfServiceDate,
      documentType: rawProps.documentType,
      eventCode: rawProps.eventCode,
      freeText: rawProps.freeText,
      hasSecondarySupportingDocuments: rawProps.hasSecondarySupportingDocuments,
      hasSupportingDocuments: rawProps.hasSupportingDocuments,
      lodged: rawProps.lodged,
      objections: rawProps.objections,
      ordinalValue: rawProps.ordinalValue,
      partyPrimary: rawProps.partyPrimary,
      partyRespondent: rawProps.partyRespondent,
      partySecondary: rawProps.partySecondary,
      practitioner: rawProps.practitioner,
      previousDocument: rawProps.previousDocument,
      primaryDocumentFile: rawProps.primaryDocumentFile,
      secondaryDocumentFile: rawProps.secondaryDocumentFile,
      secondarySupportingDocuments: rawProps.secondarySupportingDocuments,
      supportingDocuments: rawProps.supportingDocuments,
    });

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return SupportingDocumentInformationFactory.get(item);
      });
    }

    if (this.secondarySupportingDocuments) {
      this.secondarySupportingDocuments = this.secondarySupportingDocuments.map(
        item => {
          return SupportingDocumentInformationFactory.get(item);
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
    practitioner: joi.array(),
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

  let errorToMessageMap = {
    attachments: 'Enter selection for Attachments.',
    certificateOfService: 'Enter selection for Certificate of Service.',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date is in the future. Please enter a valid date.',
      },
      'Enter date for Certificate of Service',
    ],
    hasSecondarySupportingDocuments:
      'Enter selection for Secondary Supporting Documents.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    objections: 'Enter selection for Objections',
    partyPrimary: 'Select a filing party',
    partyRespondent: 'Select a filing party',
    partySecondary: 'Select a filing party',
    practitioner: 'Select a filing party',
    primaryDocumentFile: 'You must upload a document',
    primaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Primary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Primary Document file size is empty',
    ],
    secondaryDocumentFile: 'You must upload a document',
    secondaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Document file size is empty',
    ],
  };

  let customValidate;

  const addProperty = (itemName, itemSchema, itemErrorMessage) => {
    schema[itemName] = itemSchema;
    if (itemErrorMessage) {
      errorToMessageMap[itemName] = itemErrorMessage;
    }
  };

  const makeRequired = itemName => {
    if (schemaOptionalItems[itemName]) {
      schema[itemName] = schemaOptionalItems[itemName].required();
    }
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

  let partyPractitioner = false;
  if (Array.isArray(documentMetadata.practitioner)) {
    documentMetadata.practitioner.forEach(practitioner => {
      if (practitioner.partyPractitioner) {
        partyPractitioner = true;
      }
    });
  }

  if (
    documentMetadata.partyPrimary !== true &&
    documentMetadata.partySecondary !== true &&
    documentMetadata.partyRespondent !== true &&
    partyPractitioner !== true
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
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { ExternalDocumentInformationFactory };
