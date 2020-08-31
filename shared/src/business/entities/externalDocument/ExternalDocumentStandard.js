const joi = require('joi');
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

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentStandard() {}
ExternalDocumentStandard.prototype.init = function init(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.selectedCases = rawProps.selectedCases;
};

ExternalDocumentStandard.prototype.getDocumentTitle = function () {
  return this.documentTitle;
};

ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentStandard.schema = joi.object({
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
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
