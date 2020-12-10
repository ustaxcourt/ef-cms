import { state } from 'cerebral';

export const removeFromTrialSessionModalHelper = (get, applicationContext) => {
  const {
    STATUS_TYPES_MANUAL_UPDATE,
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  } = applicationContext.getConstants();
  const selectedCaseStatus = get(state.modal.caseStatus);

  const associatedJudgeRequired = STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(
    selectedCaseStatus,
  );

  return {
    associatedJudgeRequired,
    caseStatusOptions: STATUS_TYPES_MANUAL_UPDATE,
  };
};
