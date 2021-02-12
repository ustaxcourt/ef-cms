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
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeF() {}
CourtIssuedDocumentTypeF.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.judge = rawProps.judge;
  this.judgeWithTitle = rawProps.judgeWithTitle;
  this.trialLocation = rawProps.trialLocation;
};

CourtIssuedDocumentTypeF.prototype.getDocumentTitle = function () {
  const judge = this.judgeWithTitle || this.judge;
  return replaceBracketed(this.documentTitle, judge, this.trialLocation);
};

CourtIssuedDocumentTypeF.schema = {
  ...CourtIssuedDocumentDefault.schema,
  judge: JoiValidationConstants.STRING.required(),
  judgeWithtitle: JoiValidationConstants.STRING.optional(),
  trialLocation: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeF,
  CourtIssuedDocumentTypeF.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeF: validEntityDecorator(CourtIssuedDocumentTypeF),
};
