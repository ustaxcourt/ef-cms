export default async ({ applicationContext, props }) => {
  const documentBlob = await applicationContext
    .getUseCases()
    .downloadDocumentFile({
      documentId: props.documentId,
      applicationContext,
    });
  return {
    documentBlob,
  };
};
