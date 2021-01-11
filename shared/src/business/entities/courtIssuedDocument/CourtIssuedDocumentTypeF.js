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
function CourtIssuedDocumentTypeF() {}
CourtIssuedDocumentTypeF.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments || false;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.eventCode = rawProps.eventCode;
  this.filingDate = rawProps.filingDate;
  this.judge = rawProps.judge;
  this.judgeWithTitle = rawProps.judgeWithTitle;
  this.trialLocation = rawProps.trialLocation;
};

CourtIssuedDocumentTypeF.prototype.getDocumentTitle = function () {
  const judge = this.judgeWithTitle || this.judge;
  return replaceBracketed(this.documentTitle, judge, this.trialLocation);
};

CourtIssuedDocumentTypeF.schema = {
  attachments: joi.boolean().required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  eventCode: CourtIssuedDocumentDefault.schema.eventCode,
  filingDate: CourtIssuedDocumentDefault.schema.filingDate,
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
