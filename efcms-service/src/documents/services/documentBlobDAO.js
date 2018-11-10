const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');
const uuidv4 = require('uuid/v4');

exports.getDocumentDownloadUrl = async ({ documentId }) => {
  return getPersistence('files')
    .getDownloadUrl({ documentId });
}

exports.createUploadPolicy = async () => {
  return getPersistence('files')
    .createUploadPolicy();
};

exports.createDocument = async ({ userId, documentType }) => {
  if (!userId || !documentType) {
    throw new Error('documentType and userId are required');
  }

  const document = {
    documentId: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: userId,
    documentType: documentType,
  }

  return getPersistence('documents')
    .save({
      entity: document,
      type: 'document'
    });
};