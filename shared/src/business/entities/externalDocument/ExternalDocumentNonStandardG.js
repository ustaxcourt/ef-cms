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
function ExternalDocumentNonStandardG(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.ordinalValue = rawProps.ordinalValue;
}

ExternalDocumentNonStandardG.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue,
    this.documentType,
  );
};

ExternalDocumentNonStandardG.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  ordinalValue: 'Select an iteration',
};

ExternalDocumentNonStandardG.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  ordinalValue: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardG,
  ExternalDocumentNonStandardG.schema,
  undefined,
  ExternalDocumentNonStandardG.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardG };
