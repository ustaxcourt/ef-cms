import { state } from '@web-client/presenter/app.cerebral';
import { trialSessionsModalHelper } from './addToTrialSessionModalHelper';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const setForHearingModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDetail = get(state.caseDetail);
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  let excludedTrialSessionIds: String[] = [];

  if (caseDetail.trialSessionId) {
    excludedTrialSessionIds.push(caseDetail.trialSessionId);
  }

  if (caseDetail.hearings?.length) {
    caseDetail.hearings.forEach(trialSession => {
      excludedTrialSessionIds.push(trialSession.trialSessionId);
    });
  }

  const trialSessionsFilter = trialSession =>
    SESSION_STATUS_GROUPS.open === trialSession.sessionStatus;

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
