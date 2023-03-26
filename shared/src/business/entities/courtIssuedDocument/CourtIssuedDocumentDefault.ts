const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { UNSERVABLE_EVENT_CODES } = require('../EntityConstants');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

const courtIssuedDocumentDecorator = (obj, rawObj) => {
  obj.attachments = rawObj.attachments || false;
  obj.documentTitle = rawObj.documentTitle;
  obj.documentType = rawObj.documentType;
  obj.eventCode = rawObj.eventCode;
  obj.filingDate = rawObj.filingDate;
};

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentDefault() {}
CourtIssuedDocumentDefault.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
};

CourtIssuedDocumentDefault.prototype.getDocumentTitle = function () {
  return this.documentTitle;
};

CourtIssuedDocumentDefault.schema = {
  attachments: joi.boolean().required(),
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
  courtIssuedDocumentDecorator,
};
