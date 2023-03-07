const joi = require('joi');
const ordinals = require('english-ordinals');
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
function ExternalDocumentNonStandardF() {}

ExternalDocumentNonStandardF.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.ordinalValue = rawProps.ordinalValue;
  this.otherIteration = rawProps.otherIteration;
  this.previousDocument = rawProps.previousDocument;
};

const getOrdinalSuffixInWords = formVal => {
  return ordinals
    .getOrdinal(Number(formVal))
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

ExternalDocumentNonStandardF.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.otherIteration
      ? getOrdinalSuffixInWords(this.otherIteration)
      : getOrdinalSuffixInWords(this.ordinalValue),
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
  otherIteration: JoiValidationConstants.STRING.max(3).optional(), // required if ordinalValue is "Other"
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
