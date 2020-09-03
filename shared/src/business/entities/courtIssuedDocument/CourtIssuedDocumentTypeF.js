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
function CourtIssuedDocumentTypeF() {}
CourtIssuedDocumentTypeF.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.judge = rawProps.judge;
  this.trialLocation = rawProps.trialLocation;
};

CourtIssuedDocumentTypeF.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.judge, this.trialLocation);
};

CourtIssuedDocumentTypeF.schema = {
  attachments: joi.boolean().required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  judge: JoiValidationConstants.STRING.required(),
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
