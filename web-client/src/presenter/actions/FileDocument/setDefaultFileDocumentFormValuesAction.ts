import { state } from 'cerebral';

/**
 * Set default values on file document form
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultFileDocumentFormValuesAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  store.set(
    state.form.fileAcrossConsolidatedGroup,
    !!get(state.allowExternalConsolidatedGroupFiling),
  );
  store.set(state.form.attachments, false);
  store.set(state.form.certificateOfService, false);
  store.set(state.form.hasSupportingDocuments, false);
  store.set(state.form.hasSecondarySupportingDocuments, false);
  store.set(state.form.practitioner, []);

  const filersMap = {};
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.petitioner) {
    filersMap[user.userId] = true;
  }
  store.set(state.form.filersMap, filersMap);
};
