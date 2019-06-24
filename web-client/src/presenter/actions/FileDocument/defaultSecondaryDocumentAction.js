import { state } from 'cerebral';

/**
 * default secondary document.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing secondaryDocument
 * @param {object} providers.get the cerebral get function
 */
export const defaultSecondaryDocumentAction = ({ get, store }) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (!secondaryDocument) {
    store.set(state.form.secondaryDocument, {});
  }
};
