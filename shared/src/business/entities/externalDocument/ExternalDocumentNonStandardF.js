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
function ExternalDocumentNonStandardF(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.ordinalValue = rawProps.ordinalValue;
  this.previousDocument = rawProps.previousDocument;
}

ExternalDocumentNonStandardF.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue,
    this.previousDocument.documentTitle || this.previousDocument.documentType,
  );
};

ExternalDocumentNonStandardF.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardF.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  ordinalValue: joi.string().required(),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: joi.string().optional(),
      documentType: joi.string().required(),
    })
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardF,
  ExternalDocumentNonStandardF.schema,
  ExternalDocumentNonStandardF.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardF };
