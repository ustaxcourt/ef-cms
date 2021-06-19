/**
 * Fetches the details about a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getTrialSessionDetails use case
 * @param {object} providers.props the cerebral props object containing the props.sessionId
 * @returns {object} contains the details of a trial session
 */
export const getTrialSessionDetailsAction = async ({
  applicationContext,
  props,
}) => {
  const { trialSessionId } = props;
  const trialSession = await applicationContext
    .getUseCases()
    .getTrialSessionDetailsInteractor(applicationContext, {
      trialSessionId,
    });

  if (trialSession.swingSession && trialSession.swingSessionId) {
    const swingSession = await applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: trialSession.swingSessionId,
      });

    trialSession.swingSessionLocation = swingSession.trialLocation;
  }

  return { trialSession };
};
