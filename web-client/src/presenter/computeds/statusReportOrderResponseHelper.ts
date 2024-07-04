import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const statusReportOrderResponseHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDetail = get(state.caseDetail);

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;

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

  return {
    dueDateErrorText,
    isLeadCase,
    jurisdictionErrorText,
    minDate,
  };
};
