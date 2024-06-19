import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearStatusReportOrderResponseFormAction } from '../actions/clearStatusReportOrderResponseFormAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const clearStatusReportOrderResponseFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearStatusReportOrderResponseFormAction,
];
