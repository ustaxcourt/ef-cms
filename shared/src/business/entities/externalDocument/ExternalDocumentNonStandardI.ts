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
function ExternalDocumentNonStandardI() {}

ExternalDocumentNonStandardI.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.freeText = rawProps.freeText;
  this.ordinalValue = rawProps.ordinalValue;
  this.otherIteration = rawProps.otherIteration;
};

ExternalDocumentNonStandardI.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue === 'Other'
      ? transformFormValueToTitleCaseOrdinal(this.otherIteration)
      : transformFormValueToTitleCaseOrdinal(this.ordinalValue),
    this.freeText,
  );
};

ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardI.schema = {
  ...baseExternalDocumentValidation,
  freeText: JoiValidationConstants.STRING.max(1000).required(),
  ordinalValue: JoiValidationConstants.STRING.required(),
  otherIteration: joi.when('ordinalValue', {
    is: 'Other',
    otherwise: joi.optional(),
    then: JoiValidationConstants.STRING.max(3).required(),
  }),
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
