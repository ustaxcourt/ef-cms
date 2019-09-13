const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardB(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
}

ExternalDocumentNonStandardB.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.freeText);
};

ExternalDocumentNonStandardB.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  freeText: 'Provide an answer.',
};

ExternalDocumentNonStandardB.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardB,
  ExternalDocumentNonStandardB.schema,
  undefined,
  ExternalDocumentNonStandardB.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardB };
