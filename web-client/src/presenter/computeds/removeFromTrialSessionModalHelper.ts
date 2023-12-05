import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const removeFromTrialSessionModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    STATUS_TYPES,
    STATUS_TYPES_MANUAL_UPDATE,
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  } = applicationContext.getConstants();
  const selectedCaseStatus = get(state.modal.caseStatus);
  const caseDetail = get(state.caseDetail);
  const trialSessionId = get(state.modal.trialSessionId);

  const associatedJudgeRequired =
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(selectedCaseStatus);

  const isFirstTrialSession = trialSessionId === caseDetail.trialSessionId;

  const isCalendared = caseDetail.status === STATUS_TYPES.calendared;
  const showCaseStatusDropdown = !isCalendared || isFirstTrialSession;

  return {
    associatedJudgeRequired,
    caseStatusOptions: STATUS_TYPES_MANUAL_UPDATE,
    showAssociatedJudgeDropdown: associatedJudgeRequired,
    showCaseStatusDropdown,
  };
};
