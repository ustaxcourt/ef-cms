import { state } from 'cerebral';

/**
 * update the upload form for submission
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the get function
 */
export const setDocumentTitleFromFormAction = ({ get, store }) => {
  store.set(state.form.documentTitle, get(state.form.documentTitle));
};
