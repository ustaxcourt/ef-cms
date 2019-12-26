const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

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

joiValidationDecorator(PublicDocument, joi.object(), undefined, {});

module.exports = { PublicDocument };
