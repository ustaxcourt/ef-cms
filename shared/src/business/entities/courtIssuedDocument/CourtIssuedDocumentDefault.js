const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentDefault(rawProps) {
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
}

CourtIssuedDocumentDefault.prototype.getDocumentTitle = function () {
  return this.documentTitle;
};

CourtIssuedDocumentDefault.schema = {
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentDefault,
  CourtIssuedDocumentDefault.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentDefault };
