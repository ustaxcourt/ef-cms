import { state } from 'cerebral';

/**
 * updates primary contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab
 */
export const updatePrimaryContactAction = async ({
  applicationContext,
  get,
}) => {
  const { contactPrimary, docketNumber } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePrimaryContactInteractor({
      applicationContext,
      contactInfo: contactPrimary,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    docketNumber: updatedCase.docketNumber,
  };
};
