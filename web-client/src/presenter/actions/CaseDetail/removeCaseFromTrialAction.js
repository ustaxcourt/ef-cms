import { state } from 'cerebral';

/**
 * calls the removeCaseFromTrialInteractor to remove the case from the trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const removeCaseFromTrialAction = async ({
  applicationContext,
  get,
}) => {
  const { docketNumber, trialSessionId } = get(state.caseDetail);
  const { disposition } = get(state.modal);

  const caseDetail = await applicationContext
    .getUseCases()
    .removeCaseFromTrialInteractor({
      applicationContext,
      disposition,
      docketNumber,
      trialSessionId,
    });

  return {
    alertSuccess: {
      message: 'Case removed from trial.',
    },
    caseDetail,
  };
};
