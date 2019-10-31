import { state } from 'cerebral';

/**
 * Set default values on file document form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultFileDocumentFormValuesAction = ({ get, store }) => {
  const userRole = get(state.user.role);

  if (userRole === 'petitioner') {
    store.set(state.form.partyPrimary, true);
  }

  store.set(state.form.attachments, false);
  store.set(state.form.certificateOfService, false);
  store.set(state.form.exhibits, false);
  store.set(state.form.hasSupportingDocuments, false);
  store.set(state.form.hasSecondarySupportingDocuments, false);
  store.set(state.form.practitioner, []);
};
