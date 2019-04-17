import { state } from 'cerebral';

/**
 * default secondary document.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing secondaryDocument
 * @param {Object} providers.get the cerebral get function
 */
export const defaultSecondaryDocumentAction = ({ store, get }) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (!secondaryDocument) {
    store.set(state.form.secondaryDocument, {});
  }
};
