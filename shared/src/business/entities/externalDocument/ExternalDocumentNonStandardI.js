const {
  baseExternalDocumentValidation,
  externalDocumentDecorator,
} = require('./ExternalDocumentBase');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
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
function ExternalDocumentNonStandardI() {}

ExternalDocumentNonStandardI.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.freeText = rawProps.freeText;
  this.ordinalValue = rawProps.ordinalValue;
};

ExternalDocumentNonStandardI.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.ordinalValue, this.freeText);
};

ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardI.schema = {
  ...baseExternalDocumentValidation,
  freeText: JoiValidationConstants.STRING.max(1000).required(),
  ordinalValue: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardI,
  ExternalDocumentNonStandardI.schema,
  ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardI: validEntityDecorator(
    ExternalDocumentNonStandardI,
  ),
};
