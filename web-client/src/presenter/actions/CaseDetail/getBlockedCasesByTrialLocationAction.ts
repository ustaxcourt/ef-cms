/**
 * gets blocked cases by the trial location set on the form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the cases returned from the use case
 */
export const getBlockedCasesByTrialLocationAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { trialLocation, filterStatusForTrialLocation } = props;
  if (!trialLocation) return { blockedCases: [] };

  const blockedCases = await applicationContext
    .getUseCases()
    .getBlockedCasesInteractor(applicationContext, {
      trialLocation,
      filterStatusForTrialLocation,
    });

  return { blockedCases };
};
