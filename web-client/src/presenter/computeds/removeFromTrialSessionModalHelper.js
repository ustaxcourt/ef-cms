import { state } from 'cerebral';

export const removeFromTrialSessionModalHelper = (get, applicationContext) => {
  const {
    STATUS_TYPES,
    STATUS_TYPES_MANUAL_UPDATE,
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  } = applicationContext.getConstants();
  const selectedCaseStatus = get(state.modal.caseStatus);
  const caseDetail = get(state.caseDetail);
  const trialSessionId = get(state.modal.trialSessionId);

  const associatedJudgeRequired = STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(
    selectedCaseStatus,
  );

  const isFirstTrialSession = trialSessionId === caseDetail.trialSessionId;

  let defaultCaseStatus = caseDetail.status;
  if (isFirstTrialSession) {
    defaultCaseStatus = STATUS_TYPES.generalDocketReadyForTrial;
  }

  const isCalendared = caseDetail.status === STATUS_TYPES.calendared;
  const showCaseStatusDropdown = !isCalendared || isFirstTrialSession;

  return {
    associatedJudgeRequired,
    caseStatusOptions: STATUS_TYPES_MANUAL_UPDATE,
    defaultCaseStatus,
    showAssociatedJudgeDropdown: associatedJudgeRequired,
    showCaseStatusDropdown,
  };
};
