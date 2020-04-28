const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { formatDateString } = require('../../utilities/DateHandler');
const { getTimestampSchema } = require('../../../utilities/dateSchema');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

const joiStrictTimestamp = getTimestampSchema();

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardD(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.previousDocument = rawProps.previousDocument;
  this.serviceDate = rawProps.serviceDate;
}

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
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: joi.string().optional(),
      documentType: joi.string().required(),
    })
    .required(),
  serviceDate: joiStrictTimestamp.max('now').required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardD,
  ExternalDocumentNonStandardD.schema,
  undefined,
  ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardD };
