const {
  courtIssuedDocumentDecorator,
  CourtIssuedDocumentDefault,
} = require('./CourtIssuedDocumentDefault');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { formatDateString, FORMATS } = require('../../utilities/DateHandler');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeH() {}
CourtIssuedDocumentTypeH.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.date = rawProps.date;
  this.freeText = rawProps.freeText;
};

CourtIssuedDocumentTypeH.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.freeText,
    formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
  );
};

CourtIssuedDocumentTypeH.schema = {
  ...CourtIssuedDocumentDefault.schema,
  date: JoiValidationConstants.ISO_DATE.max('now').required(),
  freeText: JoiValidationConstants.STRING.max(1000).required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeH,
  CourtIssuedDocumentTypeH.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeH: validEntityDecorator(CourtIssuedDocumentTypeH),
};
