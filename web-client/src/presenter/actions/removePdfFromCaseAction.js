import { state } from 'cerebral';

/**
 * Removes a document from state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new documentUploadMode
 *
 */
export const removePdfFromCaseAction = async ({ get }) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);

  const documents = get(state.caseDetail.documents);

  (documents || []).some((document, idx) => {
    if (document.documentId === documentId) {
      documents.splice(idx, 1);
      return true;
    }
  });

  return {
    caseDetail,
    documentUploadMode: 'scan',
  };
};
