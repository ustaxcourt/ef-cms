const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentStandard(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
}

ExternalDocumentStandard.prototype.getDocumentTitle = function() {
  return this.documentTitle;
};

ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentStandard.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentStandard,
  ExternalDocumentStandard.schema,
  undefined,
  ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentStandard };
