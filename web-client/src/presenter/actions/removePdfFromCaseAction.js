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
  const form = get(state.form);
  const documentId = get(state.documentId);

  (form.documents || []).some((document, idx) => {
    if (document.documentId === documentId) {
      form.documents.splice(idx, 1);
      return true;
    }
  });

  return {
    caseDetail: form,
    documentUploadMode: 'scan',
  };
};
