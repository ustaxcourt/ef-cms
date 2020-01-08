import { state } from 'cerebral';

/**
 * updates the petitioner information action
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab, caseDetail
 */
export const updatePetitionerInformationAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const { contactPrimary, contactSecondary } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePetitionerInformationInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      contactPrimary,
      contactSecondary,
    });

  return {
    alertSuccess: {
      title: 'Your changes have been saved.',
    },
    caseDetail: updatedCase,
    caseId: updatedCase.docketNumber,
    tab: 'caseInfo',
  };
};
