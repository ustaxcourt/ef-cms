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
function CourtIssuedDocumentTypeG() {}
CourtIssuedDocumentTypeG.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.date = rawProps.date;
  this.trialLocation = rawProps.trialLocation;
};

CourtIssuedDocumentTypeG.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
    this.trialLocation,
  );
};

CourtIssuedDocumentTypeG.schema = {
  ...CourtIssuedDocumentDefault.schema,
  date: JoiValidationConstants.ISO_DATE.required(),
  trialLocation: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeG,
  CourtIssuedDocumentTypeG.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeG: validEntityDecorator(CourtIssuedDocumentTypeG),
};
