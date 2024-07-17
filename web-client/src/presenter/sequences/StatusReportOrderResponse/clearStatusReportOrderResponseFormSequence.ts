import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearStatusReportOrderResponseFormAction } from '@web-client/presenter/actions/StatusReportOrderResponse/clearStatusReportOrderResponseFormAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';

export const clearStatusReportOrderResponseFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearStatusReportOrderResponseFormAction,
] as unknown as () => void;
