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
function ExternalDocumentNonStandardF(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.ordinalValue = rawProps.ordinalValue;
  this.previousDocument = rawProps.previousDocument;
}

ExternalDocumentNonStandardF.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue,
    this.previousDocument,
  );
};

ExternalDocumentNonStandardF.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  ordinalValue: 'Select an iteration',
  previousDocument: 'Select a document',
};

ExternalDocumentNonStandardF.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  ordinalValue: joi.string().required(),
  previousDocument: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardF,
  ExternalDocumentNonStandardF.schema,
  undefined,
  ExternalDocumentNonStandardF.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardF };
