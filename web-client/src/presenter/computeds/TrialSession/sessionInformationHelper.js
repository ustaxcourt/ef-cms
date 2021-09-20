import { state } from 'cerebral';

export const sessionInformationHelper = (get, applicationContext) => {
  const { TRIAL_SESSION_SCOPE_TYPES } = applicationContext.getConstants();

  const isStandaloneSession =
    get(state.form.sessionScope) === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;

  let sessionTypes = ['Regular', 'Small', 'Hybrid'];

  if (!isStandaloneSession) {
    sessionTypes = sessionTypes.concat(['Special', 'Motion/Hearing']);
  }

  return {
    isStandaloneSession,
    sessionTypes,
  };
};
