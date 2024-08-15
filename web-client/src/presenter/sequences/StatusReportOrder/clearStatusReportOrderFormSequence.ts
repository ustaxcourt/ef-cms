import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearStatusReportOrderFormAction as clearStatusReportOrderFormAction } from '@web-client/presenter/actions/StatusReportOrder/clearStatusReportOrderFormAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';

export const clearStatusReportOrderFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearStatusReportOrderFormAction,
] as unknown as () => void;
