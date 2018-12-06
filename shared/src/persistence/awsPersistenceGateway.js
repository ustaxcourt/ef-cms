/**
 * awsPersistenceGateway
 */
const { uploadPdf } = require('./awsS3Persistence');
const { getUploadPolicy } = require('./awsHttpClientService');

module.exports = {
  uploadPdf,
  getUploadPolicy,
};
