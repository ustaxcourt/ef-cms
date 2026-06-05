import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const grantDenyMotionFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  additionalOrderTextErrorText?: string;
  isCalendared: boolean;
  isLeadCase: boolean;
  minDate: string;
  showStatusReportFields: boolean;
} => {
  const { DATE_FORMATS } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const validationErrors = get(state.validationErrors) || {};

  const minDate = applicationContext
    .getUtilities()
    .formatNow(DATE_FORMATS.YYYYMMDD);

  const isCalendared = caseDetail.status === CASE_STATUS_TYPES.calendared;
  const isOnLeadCase = isLeadCase(caseDetail);

  const showStatusReportFields = !!form.dueDateMessage;

  const additionalOrderTextErrors = Array.isArray(
    validationErrors.additionalOrderText,
  )
    ? validationErrors.additionalOrderText.find(Boolean)
    : validationErrors.additionalOrderText;

  return {
    additionalOrderTextErrorText: additionalOrderTextErrors,
    isCalendared,
    isLeadCase: isOnLeadCase,
    minDate,
    showStatusReportFields,
  };
};
