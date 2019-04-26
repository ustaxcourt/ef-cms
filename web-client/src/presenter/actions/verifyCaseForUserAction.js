import { state } from 'cerebral';

/**
 * Verifies whether the user is associated with the case or not. This value is stored
 * in state.screenMetadata.caseOwnedByUser and used to show/hide a button for
 * requesting access to the case.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Object} providers.applicationContext needed for getting the getCase use case
 * @param {Object} providers.store the cerebral store function
 * @returns {Object} contains the caseDetail returned from the use case
 */
export const verifyCaseForUserAction = async ({
  applicationContext,
  store,
  get,
}) => {
  const caseDetail = await applicationContext.getUseCases().verifyCaseForUser({
    applicationContext,
    caseId: get(state.caseDetail.caseId),
  });

  if (caseDetail) {
    store.set(state.screenMetadata.caseOwnedByUser, true);
  } else {
    store.set(state.screenMetadata.caseOwnedByUser, false);
  }
};
