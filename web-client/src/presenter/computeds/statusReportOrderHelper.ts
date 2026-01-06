import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { isLeadCase } from '@shared/business/entities/cases/Case';

export const statusReportOrderHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  dueDateErrorClass: string;
  dueDateErrorText: string;
  isCalendared: boolean;
  isLeadCase: boolean;
  jurisdictionErrorClass: string;
  jurisdictionErrorText: string;
  minDate: string;
} => {
  const caseDetail = get(state.caseDetail);

  const isLeadCaseResult = isLeadCase(caseDetail);

  const { DATE_FORMATS } = applicationContext.getConstants();

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  const validationErrors = get(state.validationErrors);

  const customDueDateError =
    validationErrors.dueDate &&
    validationErrors.dueDate.includes('stipulated decision');

  const dueDateErrorText = customDueDateError
    ? 'Select due date'
    : validationErrors.dueDate;

  const jurisdictionErrorText =
    validationErrors.jurisdiction && 'Select jurisdiction';

  const dueDateErrorClass = !validationErrors.dueDate
    ? 'status-report-order-form-group'
    : 'status-report-order-form-group-error';

  const jurisdictionErrorClass = !validationErrors.jurisdiction
    ? 'status-report-order-form-group'
    : 'status-report-order-form-group-error';

  const isCalendared = caseDetail.status === CASE_STATUS_TYPES.calendared;

  return {
    dueDateErrorClass,
    dueDateErrorText,
    isCalendared,
    isLeadCase: isLeadCaseResult,
    jurisdictionErrorClass,
    jurisdictionErrorText,
    minDate,
  };
};
