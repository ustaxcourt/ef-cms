/**
 * awsPersistenceGateway
 */
const { getDocumentUploadPolicy, uploadPdf } = require('./awsS3Persistence');

module.exports = {
  getDocumentUploadPolicy,
  uploadPdf,
};
