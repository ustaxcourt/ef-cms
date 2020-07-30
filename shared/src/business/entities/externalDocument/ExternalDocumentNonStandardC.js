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
function ExternalDocumentNonStandardC(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.previousDocument = rawProps.previousDocument;
}

ExternalDocumentNonStandardC.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.freeText,
    this.previousDocument.documentTitle || this.previousDocument.documentType,
  );
};

ExternalDocumentNonStandardC.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  freeText: 'Enter name',
};

ExternalDocumentNonStandardC.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: joi.string().optional(),
      documentType: joi.string().required(),
    })
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardC,
  ExternalDocumentNonStandardC.schema,
  ExternalDocumentNonStandardC.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardC };
