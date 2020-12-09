import { trialSessionsModalHelper } from './addToTrialSessionModalHelper';

export const setForHearingModalHelper = (get, applicationContext) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  let { trialSessionsFormatted, ...helperProps } = trialSessionsModalHelper(
    get,
    applicationContext,
  );

  if (trialSessionsFormatted) {
    trialSessionsFormatted = trialSessionsFormatted.filter(
      trialSession =>
        SESSION_STATUS_GROUPS.open === trialSession.computedStatus,
    );
  }

  return {
    ...helperProps,
    trialSessionsFormatted,
  };
};
