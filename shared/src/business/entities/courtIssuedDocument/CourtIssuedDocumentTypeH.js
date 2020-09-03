const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { formatDateString } = require('../../utilities/DateHandler');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeH() {}
CourtIssuedDocumentTypeH.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments;
  this.date = rawProps.date;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
};

CourtIssuedDocumentTypeH.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.freeText,
    formatDateString(this.date, 'MM-DD-YYYY'),
  );
};

CourtIssuedDocumentTypeH.schema = {
  attachments: joi.boolean().required(),
  date: JoiValidationConstants.ISO_DATE.max('now').required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  freeText: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeH,
  CourtIssuedDocumentTypeH.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeH: validEntityDecorator(CourtIssuedDocumentTypeH),
};
