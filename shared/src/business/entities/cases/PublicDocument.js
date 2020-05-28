const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { getTimestampSchema } = require('../../../utilities/dateSchema');

const joiStrictTimestamp = getTimestampSchema();

/**
 * PublicDocument
 *
 * @param {object} rawDocument the raw document
 * @constructor
 */
function PublicDocument(rawDocument) {
  this.additionalInfo = rawDocument.additionalInfo;
  this.additionalInfo2 = rawDocument.additionalInfo2;
  this.caseId = rawDocument.caseId;
  this.createdAt = rawDocument.createdAt;
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
  this.status = rawDocument.status;
}

joiValidationDecorator(
  PublicDocument,
  joi.object().keys({
    additionalInfo: joi.string().optional(),
    additionalInfo2: joi.string().optional(),
    caseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    createdAt: joiStrictTimestamp.optional(),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    documentTitle: joi.string().optional(),
    documentType: joi.string().optional(),
    eventCode: joi.string().optional(),
    filedBy: joi.string().optional(),
    isPaper: joi.boolean().optional(),
    processingStatus: joi.string().optional(),
    receivedAt: joiStrictTimestamp.optional(),
    servedAt: joiStrictTimestamp.optional(),
    servedParties: joi.array().optional(),
    status: joi.string().optional(),
  }),
  {},
);

module.exports = { PublicDocument };
