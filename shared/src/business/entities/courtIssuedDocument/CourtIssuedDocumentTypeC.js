const joi = require('joi-browser');
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
function CourtIssuedDocumentTypeC(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.docketNumbers = rawProps.docketNumbers;
}

CourtIssuedDocumentTypeC.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.docketNumbers);
};

CourtIssuedDocumentTypeC.schema = {
  attachments: joi.boolean().required(),
  docketNumbers: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeC,
  CourtIssuedDocumentTypeC.schema,
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeC };
