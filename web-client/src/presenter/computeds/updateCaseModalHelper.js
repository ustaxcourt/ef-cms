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

  const caseStatusOptions = [
    STATUS_TYPES.generalDocket,
    STATUS_TYPES.generalDocketReadyForTrial,
    STATUS_TYPES.submitted,
    STATUS_TYPES.cav,
    STATUS_TYPES.rule155,
    STATUS_TYPES.jurisdictionRetained,
    STATUS_TYPES.assignedCase,
    STATUS_TYPES.assignedMotion,
    STATUS_TYPES.closed,
    STATUS_TYPES.onAppeal,
  ];

  return { caseStatusOptions, showAssociatedJudgeOptions, showCalendaredAlert };
};
