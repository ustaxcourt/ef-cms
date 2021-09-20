import { state } from 'cerebral';

export const trialSessionInformationHelper = (get, applicationContext) => {
  const { TRIAL_SESSION_SCOPE_TYPES } = applicationContext.getConstants();

  const isStandaloneSession =
    get(state.form.sessionScope) === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;

    const title  = 

  return {
    isStandaloneSession,
  };
};
