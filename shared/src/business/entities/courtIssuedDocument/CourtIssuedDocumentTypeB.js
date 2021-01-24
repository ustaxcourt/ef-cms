const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { CourtIssuedDocumentDefault } = require('./CourtIssuedDocumentDefault');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeB() {}

CourtIssuedDocumentTypeB.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments || false;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.eventCode = rawProps.eventCode;
  this.filingDate = rawProps.filingDate;
  this.freeText = rawProps.freeText;
  this.judge = rawProps.judge;
  this.judgeWithTitle = rawProps.judgeWithTitle;
};

CourtIssuedDocumentTypeB.prototype.getDocumentTitle = function () {
  const judge = this.judgeWithTitle || this.judge;
  return replaceBracketed(this.documentTitle, judge, this.freeText);
};

CourtIssuedDocumentTypeB.schema = {
  attachments: joi.boolean().required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  eventCode: CourtIssuedDocumentDefault.schema.eventCode,
  filingDate: CourtIssuedDocumentDefault.schema.filingDate,
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
