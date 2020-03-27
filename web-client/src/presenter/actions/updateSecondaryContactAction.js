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
  const { caseId, contactSecondary } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updateSecondaryContactInteractor({
      applicationContext,
      caseId,
      contactInfo: contactSecondary,
    });

  return {
    alertSuccess: {
      message: 'Please confirm the information below is correct.',
      title: 'Your changes have been saved.',
    },
    caseId: updatedCase.docketNumber,
  };
};
