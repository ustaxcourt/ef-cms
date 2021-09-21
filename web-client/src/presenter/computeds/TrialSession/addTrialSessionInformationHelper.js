import { state } from 'cerebral';

export const addTrialSessionInformationHelper = (get, applicationContext) => {
  const { TRIAL_SESSION_PROCEEDING_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();

  const { proceedingType, sessionScope } = get(state.form);

  const isStandaloneSession =
    sessionScope === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;

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
    displayRemoteProceedingForm,
    isStandaloneSession,
    sessionTypes,
    title,
  };
};
