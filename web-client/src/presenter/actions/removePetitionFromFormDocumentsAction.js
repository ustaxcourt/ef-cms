import { state } from 'cerebral';

/**
 * removes the petition document from the form.documents array for replacement
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} store the cerebral store object
 * @returns {void} sets the new state for form.documents
 */

export const removePetitionFromFormDocumentsAction = ({ get, store }) => {
  const documents = get(state.form.documents);

  documents.some((document, idx) => {
    if (document.documentType === 'Petition') {
      documents.splice(idx, 1);
      return true;
    }
  });

  store.set(state.form.documents, documents);
};
