import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {void}
 */
export const updatePrimaryContactAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const contactInfo = get(state.caseDetail.contactPrimary);
  const updatedCase = await applicationContext
    .getUseCases()
    .updatePrimaryContactInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      contactInfo,
    });

  store.set(state.alertSuccess, {
    message: 'Please confirm the information below is correct.',
    title: 'Your changes have been saved.',
  });

  return {
    caseId: updatedCase.docketNumber,
    tab: 'caseInfo',
  };
};
