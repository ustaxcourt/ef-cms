const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * PublicDocument
 *
 * @param {object} rawDocument the raw document
 * @constructor
 */
function PublicDocument() {}
PublicDocument.prototype.init = function init(rawDocument) {
  this.additionalInfo = rawDocument.additionalInfo;
  this.additionalInfo2 = rawDocument.additionalInfo2;
  this.createdAt = rawDocument.createdAt;
  this.docketNumber = rawDocument.docketNumber;
  this.documentId = rawDocument.documentId;
  this.documentTitle = rawDocument.documentTitle;
  this.documentType = rawDocument.documentType;
  this.eventCode = rawDocument.eventCode;
  this.filedBy = rawDocument.filedBy;
  this.isPaper = rawDocument.isPaper;
  this.processingStatus = rawDocument.processingStatus;
  this.receivedAt = rawDocument.receivedAt;
  this.servedAt = rawDocument.servedAt;
  this.servedParties = rawDocument.servedParties;
};

joiValidationDecorator(
  PublicDocument,
  joi.object().keys({
    additionalInfo: JoiValidationConstants.STRING.max(500).optional(),
    additionalInfo2: JoiValidationConstants.STRING.max(500).optional(),
    createdAt: JoiValidationConstants.ISO_DATE.optional(),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
    documentId: JoiValidationConstants.UUID.optional(),
    documentTitle: JoiValidationConstants.STRING.max(500).optional(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).optional(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).optional(),
    filedBy: JoiValidationConstants.STRING.max(500).optional(),
    isPaper: joi.boolean().optional(),
    processingStatus: JoiValidationConstants.STRING.valid(
      ...Object.values(DOCUMENT_PROCESSING_STATUS_OPTIONS),
    ).optional(),
    receivedAt: JoiValidationConstants.ISO_DATE.optional(),
    servedAt: JoiValidationConstants.ISO_DATE.optional(),
    servedParties: joi
      .array()
      .items({ name: JoiValidationConstants.STRING.max(500).required() })
      .optional(),
  }),
  {},
);

module.exports = { PublicDocument: validEntityDecorator(PublicDocument) };
