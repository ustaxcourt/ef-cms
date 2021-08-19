import { state } from 'cerebral';

/**
 * calls the prioritizeCaseAction to prioritize a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const prioritizeCaseAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { reason } = get(state.modal);

  const caseDetail = await applicationContext
    .getUseCases()
    .prioritizeCaseInteractor(applicationContext, {
      docketNumber,
      reason,
    });

  return {
    alertSuccess: {
      message:
        'Case added to eligible list and will be set for trial when calendar is set.',
    },
    caseDetail,
  };
};
