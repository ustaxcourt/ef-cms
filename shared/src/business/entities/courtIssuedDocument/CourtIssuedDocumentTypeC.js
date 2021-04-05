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
function CourtIssuedDocumentTypeC() {}
CourtIssuedDocumentTypeC.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.docketNumbers = rawProps.docketNumbers;
};

CourtIssuedDocumentTypeC.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.docketNumbers);
};

CourtIssuedDocumentTypeC.schema = {
  ...CourtIssuedDocumentDefault.schema,
  docketNumbers: JoiValidationConstants.STRING.max(500).required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeC,
  CourtIssuedDocumentTypeC.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeC: validEntityDecorator(CourtIssuedDocumentTypeC),
};
