/**
 * get associated cases for trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} contains the associated cases for a trial sessions
 */
export const getAssociatedCasesForTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  const trialSessionId = props.trialSessionId;

  const associatedCases = await applicationContext
    .getUseCases()
    .getAssociatedCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  return { associatedCases };
};
