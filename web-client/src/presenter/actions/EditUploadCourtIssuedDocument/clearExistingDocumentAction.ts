import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state after the pdf has been cleared
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const clearExistingDocumentAction = ({ get, store }: ActionProps) => {
  store.set(state.screenMetadata.documentReset, true);
  store.set(state.currentViewMetadata.documentUploadMode, 'scan');
  store.set(state.documentToEdit.docketEntryId, get(state.form.docketEntryId));
  store.unset(state.form.primaryDocumentFile);
};
