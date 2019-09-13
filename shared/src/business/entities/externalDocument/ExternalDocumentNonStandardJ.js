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
function ExternalDocumentNonStandardJ(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.freeText2 = rawProps.freeText2;
}

ExternalDocumentNonStandardJ.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.freeText, this.freeText2);
};

ExternalDocumentNonStandardJ.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  freeText: 'Provide an answer.',
  freeText2: 'Provide an answer.',
};

ExternalDocumentNonStandardJ.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  freeText2: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardJ,
  ExternalDocumentNonStandardJ.schema,
  undefined,
  ExternalDocumentNonStandardJ.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardJ };
