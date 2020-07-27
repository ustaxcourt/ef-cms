const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeB(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.judge = rawProps.judge;
}

CourtIssuedDocumentTypeB.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.judge, this.freeText);
};

CourtIssuedDocumentTypeB.schema = {
  attachments: joi.boolean().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().optional(),
  judge: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeB,
  CourtIssuedDocumentTypeB.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeB };
