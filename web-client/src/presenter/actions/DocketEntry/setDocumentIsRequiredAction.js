import { state } from 'cerebral';

/**
 * sets the document as required when saving and serving a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store used for setting the state
 */
export const setDocumentIsRequiredAction = ({ get, store }) => {
  const documentId = get(state.documentId);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);

  if (!isEditingDocketEntry && !documentId) {
    store.set(state.form.isDocumentRequired, true);
  }
};
