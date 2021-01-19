const joi = require('joi');
const {
  GENERIC_ORDER_DOCUMENT_TYPE,
  SERVICE_STAMP_OPTIONS,
  VALIDATION_ERROR_MESSAGES,
} = require('./CourtIssuedDocumentConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { CourtIssuedDocumentDefault } = require('./CourtIssuedDocumentDefault');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeA() {}
CourtIssuedDocumentTypeA.prototype.init = function init(rawProps) {
  this.attachments = rawProps.attachments || false;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.eventCode = rawProps.eventCode;
  this.filingDate = rawProps.filingDate;
  this.freeText = rawProps.freeText;
  this.serviceStamp = rawProps.serviceStamp;
};

CourtIssuedDocumentTypeA.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.freeText);
};

CourtIssuedDocumentTypeA.schema = {
  attachments: joi.boolean().required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  eventCode: CourtIssuedDocumentDefault.schema.eventCode,
  filingDate: CourtIssuedDocumentDefault.schema.filingDate,
  freeText: JoiValidationConstants.STRING.max(1000).when('documentType', {
    is: GENERIC_ORDER_DOCUMENT_TYPE,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  serviceStamp: JoiValidationConstants.STRING.valid(
    ...SERVICE_STAMP_OPTIONS,
  ).when('documentType', {
    is: GENERIC_ORDER_DOCUMENT_TYPE,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeA,
  CourtIssuedDocumentTypeA.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeA: validEntityDecorator(CourtIssuedDocumentTypeA),
};
