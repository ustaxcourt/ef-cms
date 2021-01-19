const joi = require('joi');
const {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { CourtIssuedDocumentDefault } = require('./CourtIssuedDocumentDefault');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

const yesterdayMoment = calculateISODate({ howMuch: -1, unit: 'days' });
const yesterdayFormatted = formatDateString(
  createISODateString(yesterdayMoment),
  FORMATS.MMDDYYYY,
);

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeD() {}
CourtIssuedDocumentTypeD.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments || false;
  this.date = rawProps.date;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.eventCode = rawProps.eventCode;
  this.filingDate = rawProps.filingDate;
  this.freeText = rawProps.freeText;
};

CourtIssuedDocumentTypeD.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, 'MM-DD-YYYY'),
    this.freeText,
  );
};

CourtIssuedDocumentTypeD.schema = {
  attachments: joi.boolean().required(),
  date: JoiValidationConstants.ISO_DATE.min(yesterdayFormatted).required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  eventCode: CourtIssuedDocumentDefault.schema.eventCode,
  filingDate: CourtIssuedDocumentDefault.schema.filingDate,
  freeText: JoiValidationConstants.STRING.max(1000).optional(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeD,
  CourtIssuedDocumentTypeD.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeD: validEntityDecorator(CourtIssuedDocumentTypeD),
};
