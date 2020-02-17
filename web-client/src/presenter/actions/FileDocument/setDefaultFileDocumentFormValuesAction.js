import { state } from 'cerebral';

/**
 * Set default values on file document form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultFileDocumentFormValuesAction = ({
  applicationContext,
  store,
}) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.petitioner) {
    store.set(state.form.partyPrimary, true);
  }

  store.set(state.form.attachments, false);
  store.set(state.form.certificateOfService, false);
  store.set(state.form.exhibits, false);
  store.set(state.form.hasSupportingDocuments, false);
  store.set(state.form.hasSecondarySupportingDocuments, false);
  store.set(state.form.practitioner, []);
};
