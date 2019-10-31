/**
 * a function which retrieves a document from persistence
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.documentId the id of the document we want to download
 * @returns {Blob} the pdf within a Blob
 */
exports.downloadDocumentFileInteractor = async ({
  applicationContext,
  documentId,
}) => {
  const documentBlob = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: documentId,
    });
  return documentBlob;
};
