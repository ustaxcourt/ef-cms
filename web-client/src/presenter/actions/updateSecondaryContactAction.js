import { state } from 'cerebral';

/**
 * updates secondary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral store
 * @returns {object} alertSuccess, caseId, tab
 */
export const updateSecondaryContactAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const contactInfo = get(state.caseDetail.contactSecondary);

  const updatedCase = await applicationContext
    .getUseCases()
    .updateSecondaryContactInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      contactInfo,
    });

  return {
    alertSuccess: {
      message: 'Please confirm the information below is correct.',
      title: 'Your changes have been saved.',
    },
    caseId: updatedCase.docketNumber,
  };
};
