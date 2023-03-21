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
const { formatDateString, FORMATS } = require('../../utilities/DateHandler');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardD() {}

ExternalDocumentNonStandardD.prototype.init = function init(rawProps) {
  externalDocumentDecorator(this, rawProps);
  this.previousDocument = rawProps.previousDocument;
  this.serviceDate = rawProps.serviceDate;
};

ExternalDocumentNonStandardD.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.previousDocument
      ? this.previousDocument.documentTitle ||
          this.previousDocument.documentType
      : '',
    formatDateString(this.serviceDate, FORMATS.MMDDYYYY_DASHED),
  );
};

ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardD.schema = {
  ...baseExternalDocumentValidation,
  previousDocument: joi
    .object()
    .keys({
      documentTitle: JoiValidationConstants.STRING.optional(),
      documentType: JoiValidationConstants.STRING.required(),
    })
    .required(),
  serviceDate: JoiValidationConstants.ISO_DATE.max('now').required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardD,
  ExternalDocumentNonStandardD.schema,
  ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardD: validEntityDecorator(
    ExternalDocumentNonStandardD,
  ),
};
