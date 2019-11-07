import { state } from 'cerebral';

export const updateCaseModalHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const { STATUS_TYPES } = applicationContext.getConstants();
  const associatedJudgeCaseStatus = [
    STATUS_TYPES.submitted,
    STATUS_TYPES.cav,
    STATUS_TYPES.rule155,
    STATUS_TYPES.jurisdictionRetained,
    STATUS_TYPES.assignedCase,
    STATUS_TYPES.assignedMotion,
  ];

  const selectedStatus = get(state.modal.caseStatus);

  const showAssociatedJudgeOptions = associatedJudgeCaseStatus.includes(
    selectedStatus,
  );

  const showCalendaredAlert = caseDetail.status === STATUS_TYPES.calendared;

  return { showAssociatedJudgeOptions, showCalendaredAlert };
};
