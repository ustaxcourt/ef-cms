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
function ExternalDocumentNonStandardB(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
}

ExternalDocumentNonStandardB.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.freeText);
};

ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
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
  ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardB };
