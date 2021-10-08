const joi = require('joi');
const {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const {
  courtIssuedDocumentDecorator,
  CourtIssuedDocumentDefault,
} = require('./CourtIssuedDocumentDefault');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

const yesterdayISO = calculateISODate({ howMuch: -1, units: 'days' });
const yesterdayFormatted = formatDateString(
  createISODateString(yesterdayISO),
  FORMATS.MMDDYYYY,
);

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeD() {}
CourtIssuedDocumentTypeD.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.createdAt = rawProps.createdAt;
  this.date = rawProps.date;
  this.freeText = rawProps.freeText;
};

CourtIssuedDocumentTypeD.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
    this.freeText,
  );
};

CourtIssuedDocumentTypeD.schema = {
  ...CourtIssuedDocumentDefault.schema,
  date: joi.when('createdAt', {
    is: joi.exist().not(null),
    otherwise:
      JoiValidationConstants.ISO_DATE.min(yesterdayFormatted).required(),
    then: JoiValidationConstants.ISO_DATE.required(),
  }),
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
