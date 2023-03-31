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

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeB() {}

CourtIssuedDocumentTypeB.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.freeText = rawProps.freeText;
  this.judge = rawProps.judge;
  this.judgeWithTitle = rawProps.judgeWithTitle;
};

CourtIssuedDocumentTypeB.prototype.getDocumentTitle = function () {
  const judge = this.judgeWithTitle || this.judge;
  return replaceBracketed(this.documentTitle, judge, this.freeText);
};

CourtIssuedDocumentTypeB.schema = {
  ...CourtIssuedDocumentDefault.schema,
  freeText: JoiValidationConstants.STRING.max(1000).optional(),
  judge: JoiValidationConstants.STRING.required(),
  judgeWithTitle: JoiValidationConstants.STRING.optional(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeB,
  CourtIssuedDocumentTypeB.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeB: validEntityDecorator(CourtIssuedDocumentTypeB),
};
