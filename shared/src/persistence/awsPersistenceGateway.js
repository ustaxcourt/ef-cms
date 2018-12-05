/**
 * awsPersistenceGateway
 */
const {
  createDocumentMetadataRequest,
  getDocumentUploadPolicy,
  uploadPdf,
} = require('./awsS3Persistence');

module.exports = {
  createDocumentMetadataRequest,
  getDocumentUploadPolicy,
  uploadPdf,
};
