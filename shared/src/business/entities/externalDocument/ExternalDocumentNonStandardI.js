const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
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

ExternalDocumentNonStandardI.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.ordinalValue, this.freeText);
};

ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
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
  ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardI };
