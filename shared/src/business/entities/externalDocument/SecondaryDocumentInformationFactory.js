const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes } = require('lodash');
const { makeRequiredHelper } = require('./externalDocumentHelpers');

/**
 *
 * @constructor
 */
function SecondaryDocumentInformationFactory() {}

/**
 *
 * @param {object} documentMetadata the document metadata
 * @returns {object} the created document
 */
SecondaryDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    this.attachments = rawProps.attachments;
    this.category = rawProps.category;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentType = rawProps.documentType;
    this.objections = rawProps.objections;
    this.secondaryDocumentFile = rawProps.secondaryDocumentFile;
  };

  let schema = {};

  let schemaOptionalItems = {
    attachments: joi.boolean(),
    certificateOfService: joi.boolean(),
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    objections: joi.string(),
  };

  let errorToMessageMap = {
    attachments: 'Enter selection for Attachments.',
    certificateOfService: 'Enter selection for Certificate of Service.',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date cannot be in the future.. Enter a valid date.',
      },
      'Enter date of service',
    ],
    objections: 'Enter selection for Objections.',
  };

  const makeRequired = itemName => {
    makeRequiredHelper({
      itemName,
      schema,
      schemaOptionalItems,
    });
  };

  if (documentMetadata.secondaryDocumentFile) {
    makeRequired('attachments');
    makeRequired('certificateOfService');

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
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    undefined,
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { SecondaryDocumentInformationFactory };
