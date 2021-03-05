import { state } from 'cerebral';
import { trialSessionsModalHelper } from './addToTrialSessionModalHelper';

export const setForHearingModalHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  let excludedTrialSessionIds = [];

  if (caseDetail.trialSessionId) {
    excludedTrialSessionIds.push(caseDetail.trialSessionId);
  }

  if (caseDetail.hearings?.length) {
    caseDetail.hearings.forEach(trialSession => {
      excludedTrialSessionIds.push(trialSession.trialSessionId);
    });
  }

  const trialSessionsFilter = trialSession =>
    SESSION_STATUS_GROUPS.open === trialSession.computedStatus;

  let { trialSessionsFormatted, ...helperProps } = trialSessionsModalHelper({
    applicationContext,
    excludedTrialSessionIds,
    get,
    trialSessionsFilter,
  });

  return {
    ...helperProps,
    trialSessionsFormatted,
  };
};
