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
function ExternalDocumentNonStandardF() {}

ExternalDocumentNonStandardF.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.ordinalValue = rawProps.ordinalValue;
  this.otherIteration = rawProps.otherIteration;
  this.previousDocument = rawProps.previousDocument;
};

ExternalDocumentNonStandardF.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue === 'Other'
      ? transformFormValueToTitleCaseOrdinal(this.otherIteration)
      : transformFormValueToTitleCaseOrdinal(this.ordinalValue),
    this.previousDocument
      ? this.previousDocument.documentTitle ||
          this.previousDocument.documentType
      : '',
  );
};

ExternalDocumentNonStandardF.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardF.schema = {
  ...baseExternalDocumentValidation,
  ordinalValue: JoiValidationConstants.STRING.required(),
  otherIteration: joi.when('ordinalValue', {
    is: 'Other',
    otherwise: joi.optional(),
    then: JoiValidationConstants.STRING.max(3).required(),
  }),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: JoiValidationConstants.STRING.optional(),
      documentType: JoiValidationConstants.STRING.required(),
    })
    .required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardF,
  ExternalDocumentNonStandardF.schema,
  ExternalDocumentNonStandardF.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardF: validEntityDecorator(
    ExternalDocumentNonStandardF,
  ),
};
