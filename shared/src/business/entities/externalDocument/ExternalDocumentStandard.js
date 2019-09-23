const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

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

ExternalDocumentStandard.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
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
  ExternalDocumentStandard.errorToMessageMap,
);

module.exports = { ExternalDocumentStandard };
