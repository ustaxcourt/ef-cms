const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { VALIDATION_ERROR_MESSAGES } = require('./validationErrorMessages');

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeA(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
}

CourtIssuedDocumentTypeA.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.freeText);
};

CourtIssuedDocumentTypeA.schema = {
  attachments: joi.boolean().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeA,
  CourtIssuedDocumentTypeA.schema,
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeA };
