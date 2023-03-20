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
function ExternalDocumentNonStandardB() {}

ExternalDocumentNonStandardB.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.freeText = rawProps.freeText;
};

ExternalDocumentNonStandardB.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.freeText);
};

ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardB.schema = {
  ...baseExternalDocumentValidation,
  freeText: JoiValidationConstants.STRING.max(1000).required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardB,
  ExternalDocumentNonStandardB.schema,
  ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardB: validEntityDecorator(
    ExternalDocumentNonStandardB,
  ),
};
