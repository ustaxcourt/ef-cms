const joi = require('joi');
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
function CourtIssuedDocumentTypeB() {}

CourtIssuedDocumentTypeB.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments || false;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
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
  freeText: JoiValidationConstants.STRING.optional(),
  judge: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeB,
  CourtIssuedDocumentTypeB.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeB: validEntityDecorator(CourtIssuedDocumentTypeB),
};
