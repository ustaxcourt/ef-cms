/**
 * Fetches the eligible cases for a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral props object containing the props.trialSessionId
 * @returns {object} contains the eligible cases for a trial sessions
 */
export const getEligibleCasesForTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  const { trialSessionId } = props;
  const eligibleCases = await applicationContext
    .getUseCases()
    .getEligibleCasesForTrialSessionInteractor(applicationContext, {
      trialSessionId,
    });

  return { eligibleCases };
};
