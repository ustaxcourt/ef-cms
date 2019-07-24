import { state } from 'cerebral';

/**
 * Clears secondary document.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing secondaryDocument
 */
export const clearSecondaryDocumentFormAction = ({ store }) => {
  store.set(state.form.secondaryDocument, null);
};
