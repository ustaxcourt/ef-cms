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
function CourtIssuedDocumentTypeC() {}
CourtIssuedDocumentTypeC.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.docketNumbers = rawProps.docketNumbers;
  this.documentType = rawProps.documentType;
};

CourtIssuedDocumentTypeC.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.docketNumbers);
};

CourtIssuedDocumentTypeC.schema = {
  attachments: joi.boolean().required(),
  docketNumbers: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeC,
  CourtIssuedDocumentTypeC.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeC: validEntityDecorator(CourtIssuedDocumentTypeC),
};
