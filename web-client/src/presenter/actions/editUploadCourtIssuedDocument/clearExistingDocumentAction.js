import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearExistingDocumentAction = ({ get, store }) => {
  store.set(state.screenMetadata.documentReset, true);
  store.unset(state.form.primaryDocumentFile);
  store.set(state.form.documentIdToEdit, get(state.form.documentId));
};
