import { state } from 'cerebral';

export const updateCaseModalHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const {
    STATUS_TYPES,
    STATUS_TYPES_MANUAL_UPDATE,
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  } = applicationContext.getConstants();

  const selectedStatus = get(state.modal.caseStatus);

  const showAssociatedJudgeOptions = STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(
    selectedStatus,
  );

  const showCalendaredAlert = caseDetail.status === STATUS_TYPES.calendared;

  return {
    caseStatusOptions: STATUS_TYPES_MANUAL_UPDATE,
    showAssociatedJudgeOptions,
    showCalendaredAlert,
  };
};
