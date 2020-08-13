import { state } from 'cerebral';

/**
 * Deletes an uploaded pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new documentUploadMode
 *
 */
export const deleteUploadedPdfAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const documentId = get(state.documentId);

  const updatedCase = await applicationContext
    .getUseCases()
    .deleteDocumentInteractor({
      applicationContext,
      docketNumber,
      documentId,
    });

  return {
    caseDetail: updatedCase,
    documentUploadMode: 'scan',
  };
};
