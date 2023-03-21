const joi = require('joi');
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
function ExternalDocumentNonStandardG() {}
ExternalDocumentNonStandardG.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.ordinalValue = rawProps.ordinalValue;
};

ExternalDocumentNonStandardG.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue,
    this.documentType,
  );
};

ExternalDocumentNonStandardG.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardG.schema = {
  ...baseExternalDocumentValidation,
  ordinalValue: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardG,
  joi.object(ExternalDocumentNonStandardG.schema),
  ExternalDocumentNonStandardG.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardG: validEntityDecorator(
    ExternalDocumentNonStandardG,
  ),
};
