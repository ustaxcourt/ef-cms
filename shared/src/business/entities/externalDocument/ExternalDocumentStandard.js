const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentStandard(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.selectedCases = rawProps.selectedCases;
}

ExternalDocumentStandard.prototype.getDocumentTitle = function () {
  return this.documentTitle;
};

ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentStandard.schema = joi.object({
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi
    .string()
    .required()
    .when('selectedCases', {
      is: joi.array().min(1).required(),
      then: joi.string().invalid('Proposed Stipulated Decision'),
    }),
  selectedCases: joi.array().items(joi.string()).optional(),
});

joiValidationDecorator(
  ExternalDocumentStandard,
  ExternalDocumentStandard.schema,
  ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentStandard };
