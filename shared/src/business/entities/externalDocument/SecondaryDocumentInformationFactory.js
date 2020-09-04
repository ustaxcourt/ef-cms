const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
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
 * @param {object} VALIDATION_ERROR_MESSAGES the error to message map constant
 * @returns {object} the created document
 */
SecondaryDocumentInformationFactory.get = (
  documentMetadata,
  VALIDATION_ERROR_MESSAGES,
) => {
  /**
   *
   */
  function entityConstructor() {}
  entityConstructor.prototype.init = function init(rawProps) {
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
    certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
    objections: JoiValidationConstants.STRING,
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

  joiValidationDecorator(entityConstructor, schema, VALIDATION_ERROR_MESSAGES);

  return new (validEntityDecorator(entityConstructor))(documentMetadata);
};

module.exports = { SecondaryDocumentInformationFactory };
