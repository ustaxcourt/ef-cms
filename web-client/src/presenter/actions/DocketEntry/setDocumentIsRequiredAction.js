import { state } from 'cerebral';

/**
 * sets the document as required when saving and serving a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state
 */
export const setDocumentIsRequiredAction = ({ store }) => {
  store.set(state.form.isDocumentRequired, true);
};
