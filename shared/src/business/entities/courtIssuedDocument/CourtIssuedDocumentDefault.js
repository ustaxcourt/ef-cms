const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { UNSERVABLE_EVENT_CODES } = require('../EntityConstants');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentDefault() {}
CourtIssuedDocumentDefault.prototype.init = function init(rawProps) {
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.eventCode = rawProps.eventCode;
  this.filingDate = rawProps.filingDate;
};

CourtIssuedDocumentDefault.prototype.getDocumentTitle = function () {
  return this.documentTitle;
};

CourtIssuedDocumentDefault.schema = {
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  eventCode: JoiValidationConstants.STRING.optional(),
  filingDate: joi.when('eventCode', {
    is: joi
      .exist()
      .not(null)
      .valid(...UNSERVABLE_EVENT_CODES),
    otherwise: joi.optional().allow(null),
    then: JoiValidationConstants.ISO_DATE.max('now').required(),
  }),
};

joiValidationDecorator(
  CourtIssuedDocumentDefault,
  CourtIssuedDocumentDefault.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentDefault: validEntityDecorator(CourtIssuedDocumentDefault),
};
