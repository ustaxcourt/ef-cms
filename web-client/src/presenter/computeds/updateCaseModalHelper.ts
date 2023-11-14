import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDetail = get(state.caseDetail);
  const {
    STATUS_TYPES,
    STATUS_TYPES_MANUAL_UPDATE,
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  } = applicationContext.getConstants();

  const selectedStatus = get(state.modal.caseStatus);

  const showAssociatedJudgeOptions =
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(selectedStatus);

  const isCalendared = caseDetail.status === STATUS_TYPES.calendared;
  const showCalendaredAlert = isCalendared;
  const showCaseStatusDropdown = !isCalendared;
  const showNewStatusOption = caseDetail.status === STATUS_TYPES.new;

  return {
    caseStatusOptions: STATUS_TYPES_MANUAL_UPDATE,
    showAssociatedJudgeOptions,
    showCalendaredAlert,
    showCaseStatusDropdown,
    showNewStatusOption,
  };
};
