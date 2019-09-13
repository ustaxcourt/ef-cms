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
function ExternalDocumentNonStandardI(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.ordinalValue = rawProps.ordinalValue;
}

ExternalDocumentNonStandardI.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.ordinalValue, this.freeText);
};

ExternalDocumentNonStandardI.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  freeText: 'Provide an answer.',
  ordinalValue: 'Select an iteration.',
};

ExternalDocumentNonStandardI.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  ordinalValue: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardI,
  ExternalDocumentNonStandardI.schema,
  undefined,
  ExternalDocumentNonStandardI.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardI };
