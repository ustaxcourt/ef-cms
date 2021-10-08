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
function CourtIssuedDocumentTypeE() {}
CourtIssuedDocumentTypeE.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.createdAt = rawProps.createdAt;
  this.date = rawProps.date;
};

CourtIssuedDocumentTypeE.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
  );
};

CourtIssuedDocumentTypeE.schema = {
  ...CourtIssuedDocumentDefault.schema,
  date: joi.when('createdAt', {
    is: joi.exist().not(null),
    otherwise:
      JoiValidationConstants.ISO_DATE.min(yesterdayFormatted).required(),
    then: JoiValidationConstants.ISO_DATE.required(),
  }),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeE,
  CourtIssuedDocumentTypeE.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeE: validEntityDecorator(CourtIssuedDocumentTypeE),
};
