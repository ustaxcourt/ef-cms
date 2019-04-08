import { state } from 'cerebral';

/**
 * Clears secondary document.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing secondaryDocument
 */
export const clearSecondaryDocumentFormAction = ({ store }) => {
  store.set(state.form.secondaryDocument, null);
};
