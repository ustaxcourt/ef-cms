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
