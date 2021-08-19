import { state } from 'cerebral';

/**
 * calls the unprioritizeCaseAction to unprioritize the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const unprioritizeCaseAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const caseDetail = await applicationContext
    .getUseCases()
    .unprioritizeCaseInteractor(applicationContext, {
      docketNumber,
    });

  return {
    alertSuccess: {
      message:
        'High priority removed. Case is eligible for next available trial session.',
    },
    caseDetail,
  };
};
