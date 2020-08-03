import { state } from 'cerebral';

/**
 * deletes an uploaded pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new documentUploadMode
 *
 */
export const deleteUploadedPdfAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const documentId = get(state.documentId);

  console.log(get(state.currentViewMetadata.documentSelectedForPreview));

  store.unset(state.pdfPreviewUrl);

  const updatedCase = await applicationContext
    .getUseCases()
    .deleteDraftDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId,
    });

  return {
    caseDetail: updatedCase,
    documentUploadMode: 'scan',
  };
};
