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

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentStandard() {}
ExternalDocumentStandard.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.selectedCases = rawProps.selectedCases;
};

ExternalDocumentStandard.prototype.getDocumentTitle = function () {
  return this.documentTitle;
};

ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentStandard.schema = joi.object({
  ...baseExternalDocumentValidation,
  documentType: JoiValidationConstants.STRING.required().when('selectedCases', {
    is: joi.array().min(1).required(),
    then: JoiValidationConstants.STRING.invalid('Proposed Stipulated Decision'),
  }),
  selectedCases: joi.array().items(JoiValidationConstants.STRING).optional(),
});

joiValidationDecorator(
  ExternalDocumentStandard,
  ExternalDocumentStandard.schema,
  ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentStandard: validEntityDecorator(ExternalDocumentStandard),
};
