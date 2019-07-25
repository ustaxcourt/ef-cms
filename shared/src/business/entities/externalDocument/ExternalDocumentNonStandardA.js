const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardA(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.previousDocument = rawProps.previousDocument;
}

ExternalDocumentNonStandardA.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.previousDocument);
};

ExternalDocumentNonStandardA.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
  previousDocument: 'Select a document.',
};

ExternalDocumentNonStandardA.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  previousDocument: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardA,
  ExternalDocumentNonStandardA.schema,
  undefined,
  ExternalDocumentNonStandardA.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardA };
