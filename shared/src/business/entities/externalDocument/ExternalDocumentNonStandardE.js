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
function ExternalDocumentNonStandardE() {}

ExternalDocumentNonStandardE.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.trialLocation = rawProps.trialLocation;
};

ExternalDocumentNonStandardE.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.trialLocation);
};

ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardE.schema = {
  ...baseExternalDocumentValidation,
  trialLocation: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardE,
  ExternalDocumentNonStandardE.schema,
  ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardE: validEntityDecorator(
    ExternalDocumentNonStandardE,
  ),
};
