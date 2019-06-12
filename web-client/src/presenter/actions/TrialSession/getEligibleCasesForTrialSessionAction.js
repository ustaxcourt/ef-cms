/**
 * Fetches the eligible cases for a trial sessions
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
  const trialSessionId = props.trialSessionId;
  const eligibleCases = await applicationContext
    .getUseCases()
    .getEligibleCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  return { eligibleCases };
};
