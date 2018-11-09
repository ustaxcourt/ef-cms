const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');

exports.getDocumentDownloadUrl = async ({ documentId }) => {
  return getPersistence('files')
    .getDocumentDownloadUrl({ documentId });
}

exports.createUploadPolicy = async () => {
  return getPersistence('files')
    .createUploadPolicy();
};

exports.createDocument = async ({ userId, documentType }) => {
  if (!userId || !documentType) {
    throw new Error('documentType and userId are required');
  }

  return getPersistence('documents')
    .createDocument({ userId, documentType });
};