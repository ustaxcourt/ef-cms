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
  this.caseId = rawDocument.caseId;
  this.documentId = rawDocument.documentId;
  this.eventCode = rawDocument.eventCode;
  this.filedBy = rawDocument.filedBy;
  this.createdAt = rawDocument.createdAt;
  this.receivedAt = rawDocument.receivedAt;
  this.documentType = rawDocument.documentType;
  this.processingStatus = rawDocument.processingStatus;
}

joiValidationDecorator(PublicDocument, joi.object(), undefined, {});

module.exports = { PublicDocument };
