const joi = require('joi');
const ordinals = require('english-ordinals');
const {
  baseExternalDocumentValidation,
  externalDocumentDecorator,
} = require('./ExternalDocumentBase');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardF() {}

ExternalDocumentNonStandardF.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.ordinalValue = rawProps.ordinalValue;
  this.previousDocument = rawProps.previousDocument;
};

ExternalDocumentNonStandardF.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    ordinals.getOrdinal(Number(this.ordinalValue)).charAt(0).toUpperCase() +
      ordinals.getOrdinal(Number(this.ordinalValue)).slice(1),
    this.previousDocument
      ? this.previousDocument.documentTitle ||
          this.previousDocument.documentType
      : '',
  );
};

ExternalDocumentNonStandardF.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardF.schema = {
  ...baseExternalDocumentValidation,
  ordinalValue: JoiValidationConstants.STRING.required(),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: JoiValidationConstants.STRING.optional(),
      documentType: JoiValidationConstants.STRING.required(),
    })
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardF,
  ExternalDocumentNonStandardF.schema,
  ExternalDocumentNonStandardF.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardF: validEntityDecorator(
    ExternalDocumentNonStandardF,
  ),
};
