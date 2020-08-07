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
function CourtIssuedDocumentTypeF(rawProps) {
  this.attachments = rawProps.attachments;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.judge = rawProps.judge;
  this.trialLocation = rawProps.trialLocation;
}

CourtIssuedDocumentTypeF.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.judge, this.trialLocation);
};

CourtIssuedDocumentTypeF.schema = {
  attachments: joi.boolean().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  judge: joi.string().required(),
  trialLocation: joi.string().required(),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeF,
  CourtIssuedDocumentTypeF.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = { CourtIssuedDocumentTypeF };
