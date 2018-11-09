const { create: getPersistence } = require('../../persistence/entityPersistenceFactory');

exports.getDocumentDownloadUrl = async ({ documentId }) => {
  return await getPersistence('files')
    .getDocumentDownloadUrl({ documentId });
}