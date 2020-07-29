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
function ExternalDocumentNonStandardA(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.previousDocument = rawProps.previousDocument;
}

ExternalDocumentNonStandardA.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.previousDocument.documentTitle || this.previousDocument.documentType,
  );
};

ExternalDocumentNonStandardA.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardA.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: joi.string().optional(),
      documentType: joi.string().required(),
    })
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardA,
  ExternalDocumentNonStandardA.schema,
  ExternalDocumentNonStandardA.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardA };
