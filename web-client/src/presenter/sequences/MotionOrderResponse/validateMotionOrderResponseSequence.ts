import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { validateMotionOrderResponseFormAction } from '../../actions/MotionOrderResponse/validateMotionOrderResponseFormAction';

export const validateMotionOrderResponseSequence = [
  clearAlertsAction,
  validateMotionOrderResponseFormAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction],
  },
] as unknown as () => void;
