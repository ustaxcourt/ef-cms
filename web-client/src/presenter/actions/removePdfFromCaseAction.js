import { state } from 'cerebral';

/**
 * Removes a document from state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new documentUploadMode
 */
export const removePdfFromCaseAction = ({ get }) => {
  const form = get(state.form);
  const docketEntryId = get(state.docketEntryId);

  if (docketEntryId) {
    (form.docketEntries || []).some((document, idx) => {
      if (document.docketEntryId === docketEntryId) {
        form.docketEntries.splice(idx, 1);
        return true;
      }
    });
  } else {
    const fileKeyToRemove = get(
      state.currentViewMetadata.documentSelectedForPreview,
    );

    delete form[fileKeyToRemove];
  }

  return {
    caseDetail: form,
    documentUploadMode: 'scan',
  };
};
