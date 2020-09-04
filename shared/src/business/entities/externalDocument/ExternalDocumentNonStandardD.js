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
const { formatDateString } = require('../../utilities/DateHandler');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardD() {}

ExternalDocumentNonStandardD.prototype.init = function init(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.previousDocument = rawProps.previousDocument;
  this.serviceDate = rawProps.serviceDate;
};

ExternalDocumentNonStandardD.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.previousDocument.documentTitle || this.previousDocument.documentType,
    formatDateString(this.serviceDate, 'MM-DD-YYYY'),
  );
};

ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardD.schema = {
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
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
