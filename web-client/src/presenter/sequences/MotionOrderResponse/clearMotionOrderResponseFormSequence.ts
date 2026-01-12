import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { clearMotionOrderResponseFormAction } from '@web-client/presenter/actions/MotionOrderResponse/clearMotionOrderResponseFormAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';

export const clearMotionOrderResponseFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearMotionOrderResponseFormAction,
] as unknown as () => void;
