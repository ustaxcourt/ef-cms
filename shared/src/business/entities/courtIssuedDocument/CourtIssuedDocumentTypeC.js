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
function CourtIssuedDocumentTypeC() {}
CourtIssuedDocumentTypeC.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments || false;
  this.documentTitle = rawProps.documentTitle;
  this.docketNumbers = rawProps.docketNumbers;
  this.documentType = rawProps.documentType;
  this.eventCode = rawProps.eventCode;
  this.filingDate = rawProps.filingDate;
};

CourtIssuedDocumentTypeC.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.docketNumbers);
};

CourtIssuedDocumentTypeC.schema = {
  attachments: joi.boolean().required(),
  docketNumbers: JoiValidationConstants.STRING.max(500).required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  eventCode: CourtIssuedDocumentDefault.schema.eventCode,
  filingDate: CourtIssuedDocumentDefault.schema.filingDate,
};

joiValidationDecorator(
  CourtIssuedDocumentTypeC,
  CourtIssuedDocumentTypeC.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeC: validEntityDecorator(CourtIssuedDocumentTypeC),
};
