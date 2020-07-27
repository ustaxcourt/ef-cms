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
  const { contactSecondary, docketNumber } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updateSecondaryContactInteractor({
      applicationContext,
      contactInfo: contactSecondary,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    docketNumber: updatedCase.docketNumber,
  };
};
