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
const { TRIAL_SESSION_SCOPE_TYPES } = require('../EntityConstants');
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
  this.freeText = rawProps.freeText;
};

CourtIssuedDocumentTypeF.prototype.getDocumentTitle = function () {
  const judge = this.judgeWithTitle || this.judge;

  if (this.trialLocation === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote) {
    this.documentTitle = this.documentTitle.replace(
      'at [Place]',
      'in standalone remote session',
    );

    return replaceBracketed(this.documentTitle, judge, this.freeText);
  }

  return replaceBracketed(
    this.documentTitle,
    judge,
    this.trialLocation,
    this.freeText,
  );
};

CourtIssuedDocumentTypeF.schema = {
  ...CourtIssuedDocumentDefault.schema,
  freeText: JoiValidationConstants.STRING.max(1000).optional(),
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
