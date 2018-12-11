exports.downloadDocumentFile = async ({ documentId, applicationContext }) => {
  const documentBlob = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      documentId: documentId,
      applicationContext,
    });
  return documentBlob;
};
