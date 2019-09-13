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
function ExternalDocumentNonStandardC(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.previousDocument = rawProps.previousDocument;
}

ExternalDocumentNonStandardC.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.freeText,
    this.previousDocument,
  );
};

ExternalDocumentNonStandardC.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  freeText: 'Enter name.',
  previousDocument: 'Select a document',
};

ExternalDocumentNonStandardC.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  previousDocument: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardC,
  ExternalDocumentNonStandardC.schema,
  undefined,
  ExternalDocumentNonStandardC.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardC };
