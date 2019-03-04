exports.downloadDocumentFile = async ({ documentId, applicationContext }) => {
  const documentBlob = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: documentId,
    });
  return documentBlob;
};
