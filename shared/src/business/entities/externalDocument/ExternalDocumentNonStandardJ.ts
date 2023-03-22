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
function ExternalDocumentNonStandardJ() {}

ExternalDocumentNonStandardJ.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.freeText = rawProps.freeText;
  this.freeText2 = rawProps.freeText2;
};

ExternalDocumentNonStandardJ.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.freeText, this.freeText2);
};

ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardJ.schema = {
  ...baseExternalDocumentValidation,
  freeText: JoiValidationConstants.STRING.max(1000).required(),
  freeText2: JoiValidationConstants.STRING.max(1000).required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardJ,
  ExternalDocumentNonStandardJ.schema,
  ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardJ: validEntityDecorator(
    ExternalDocumentNonStandardJ,
  ),
};
