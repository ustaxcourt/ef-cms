const joi = require('joi-browser');
const moment = require('moment');
const {
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../../utilities/DateHandler');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

const yesterdayMoment = moment().subtract(1, 'd');
const yesterdayFormatted = formatDateString(
  createISODateString(yesterdayMoment),
  FORMATS.MMDDYYYY,
);

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeE(rawProps) {
  this.attachments = rawProps.attachments;
  this.date = rawProps.date;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
}

CourtIssuedDocumentTypeE.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, 'MM-DD-YYYY'),
  );
};

CourtIssuedDocumentTypeE.schema = {
  attachments: joi.boolean().required(),
  date: joi
    .date()
    .iso()
    .min(yesterdayFormatted)
    .required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeE,
  CourtIssuedDocumentTypeE.schema,
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeE };
