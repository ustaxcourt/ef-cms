/**
 * Downloads the document blob who's id matches props.documentId and invokes the props.callback with the blob.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the downloadDocumentFile use case
 * @param {Object} providers.props the cerebral props that contains documentId.
 */
export const getDocumentAction = async ({ applicationContext, props }) => {
  const documentBlob = await applicationContext
    .getUseCases()
    .downloadDocumentFile({
      documentId: props.documentId,
      applicationContext,
    });
  props.callback(documentBlob);
};
