exports.getDocumentContentsForDocuments = async ({
  applicationContext,
  documents,
}) => {
  for (const document of documents) {
    if (document.documentContentsId) {
      const documentContentsFile = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          documentId: document.documentContentsId,
          protocol: 'S3',
          useTempBucket: false,
        });

      const documentContentsData = JSON.parse(documentContentsFile.toString());
      document.documentContents = documentContentsData.documentContents;
      document.draftState = {
        ...document.draftState,
        documentContents: documentContentsData.documentContents,
        richText: documentContentsData.richText,
      };
    }
  }

  return documents;
};
