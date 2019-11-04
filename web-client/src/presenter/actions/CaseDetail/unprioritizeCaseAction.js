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
  const { caseId } = get(state.caseDetail);

  const caseDetail = await applicationContext
    .getUseCases()
    .unprioritizeCaseInteractor({
      applicationContext,
      caseId,
    });

  return {
    alertSuccess: {
      message:
        'This case will be set for trial according to standard priority.',
      title: 'The high priority on this case has been removed.',
    },
    caseDetail,
  };
};
