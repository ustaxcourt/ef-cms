const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { includes } = require('lodash');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { makeRequiredHelper } = require('./externalDocumentHelpers');

/**
 * Secondary Document Information Factory entity
 *
 * @param {object} documentMetadata the document metadata
 * @param {object} VALIDATION_ERROR_MESSAGES the error to message map constant
 * @constructor
 */
function SecondaryDocumentInformationFactory(
  documentMetadata,
  VALIDATION_ERROR_MESSAGES,
) {
  /**
   * bare constructor for entity factory
   */
  function entityConstructor() {}

  entityConstructor.prototype.init = function init(rawProps) {
    this.attachments = rawProps.attachments || false;
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
}

module.exports = { SecondaryDocumentInformationFactory };
