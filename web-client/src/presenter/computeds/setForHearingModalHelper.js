import { state } from 'cerebral';
import { trialSessionsModalHelper } from './addToTrialSessionModalHelper';

export const setForHearingModalHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  let assignedTrialSessionIds = [];

  if (caseDetail.trialSessionId) {
    assignedTrialSessionIds.push(caseDetail.trialSessionId);
    caseDetail.hearings.forEach(trialSession => {
      assignedTrialSessionIds.push(trialSession.trialSessionId);
    });
  }

  let { trialSessionsFormatted, ...helperProps } = trialSessionsModalHelper(
    get,
    applicationContext,
    assignedTrialSessionIds,
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
