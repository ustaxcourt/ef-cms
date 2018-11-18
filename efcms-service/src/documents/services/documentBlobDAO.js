const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');
const uuidv4 = require('uuid/v4');
const documentsPersistence = getPersistence('documents');
const filesPersistence = getPersistence('files');

exports.getDocumentDownloadUrl = ({ documentId, persistence = filesPersistence } = {}) => {
  if (!documentId) {
    throw new Error('documentId is required');
  }
  return persistence
    .getDownloadUrl({ documentId });
}

exports.createUploadPolicy = ({ persistence = filesPersistence } = {}) => {
  return persistence
    .createUploadPolicy();
};

exports.createDocument = ({ userId, documentType, persistence = documentsPersistence }) => {
  if (!userId || !documentType) {
    throw new Error('documentType and userId are required');
  }

  const document = {
    documentId: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: userId,
    documentType: documentType,
  }

  return persistence
    .save({
      entity: document,
      type: 'document'
    });
};
