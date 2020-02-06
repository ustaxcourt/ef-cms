import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearExistingDocumentAction = ({ store }) => {
  store.set(state.screenMetadata.documentReset, true);
  store.unset(state.form.primaryDocumentFile);
};
