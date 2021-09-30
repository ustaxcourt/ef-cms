import { state } from 'cerebral';

export const addTrialSessionInformationHelper = (get, applicationContext) => {
  const { TRIAL_SESSION_PROCEEDING_TYPES } = applicationContext.getConstants();

  const { proceedingType, sessionScope } = get(state.form);

  // FEATURE FLAG: standalone_remote_session
  const FEATURE_canDisplayStandaloneRemote =
    applicationContext.isFeatureEnabled('standalone_remote_session');

  const isStandaloneSession = applicationContext
    .getUtilities()
    .isStandaloneRemoteSession(sessionScope);

  const title = isStandaloneSession
    ? 'Remote Proceeding Information'
    : 'Location Information';

  const displayRemoteProceedingForm =
    proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote ||
    isStandaloneSession;

  let sessionTypes = ['Regular', 'Small', 'Hybrid'];

  if (!isStandaloneSession) {
    sessionTypes = sessionTypes.concat(['Special', 'Motion/Hearing']);
  }

  return {
    FEATURE_canDisplayStandaloneRemote,
    displayRemoteProceedingForm,
    isStandaloneSession,
    sessionTypes,
    title,
  };
};
