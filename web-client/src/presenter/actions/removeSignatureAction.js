/**
 * calls use case to remove signature from the document in props.documentIdToEdit
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the props needed for removing signature
 */
export const removeSignatureAction = async ({ applicationContext, props }) => {
  const { docketNumber } = props.caseDetail;
  const documentId = props.documentIdToEdit;

  const updatedCase = await applicationContext
    .getUseCases()
    .removeSignatureFromDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId,
    });

  return {
    caseDetail: updatedCase,
    viewerDraftDocumentToDisplay: { documentId },
  };
};
