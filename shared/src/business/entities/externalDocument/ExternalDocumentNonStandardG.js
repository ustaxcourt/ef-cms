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
  transformFormValueToTitleCaseOrdinal,
} = require('../../utilities/transformFormValueToTitleCaseOrdinal');
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
  this.otherIteration = rawProps.otherIteration;
};

ExternalDocumentNonStandardG.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue === 'Other'
      ? transformFormValueToTitleCaseOrdinal(this.otherIteration)
      : transformFormValueToTitleCaseOrdinal(this.ordinalValue),
    this.documentType,
  );
};

ExternalDocumentNonStandardG.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardG.schema = {
  ...baseExternalDocumentValidation,
  ordinalValue: JoiValidationConstants.STRING.required(),
  otherIteration: joi.when('ordinalValue', {
    is: 'Other',
    otherwise: joi.optional(),
    then: JoiValidationConstants.STRING.max(3).required(),
  }),
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
