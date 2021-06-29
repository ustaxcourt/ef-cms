const {
  courtIssuedDocumentDecorator,
  CourtIssuedDocumentDefault,
} = require('./CourtIssuedDocumentDefault');
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
  courtIssuedDocumentDecorator(this, rawProps);
  this.date = rawProps.date;
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
