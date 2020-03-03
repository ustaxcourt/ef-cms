import { state } from 'cerebral';

/**
 * set the state after the pdf has been cleared
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const clearExistingDocumentAction = ({ get, store }) => {
  store.set(state.screenMetadata.documentReset, true);
  store.set(state.documentToEdit.documentId, get(state.form.documentId));
  store.unset(state.form.primaryDocumentFile);
};
