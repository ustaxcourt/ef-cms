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

  console.log('before remove ', { ...form.documents });

  (form.documents || []).some((document, idx) => {
    if (document.documentId === documentId) {
      console.log('FOUND THIS ', document);
      form.documents.splice(idx, 1);
      return true;
    }
  });

  console.log('after remove ', { ...form.documents });

  return {
    caseDetail: form,
    documentUploadMode: 'scan',
  };
};
