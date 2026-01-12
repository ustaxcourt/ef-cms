import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { validateMotionOrderResponseFormAction } from '../../actions/MotionOrderResponse/validateMotionOrderResponseFormAction';
import { shouldValidateAction } from '@web-client/presenter/actions/shouldValidateAction';

export const validateMotionOrderResponseSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      clearAlertsAction,
      validateMotionOrderResponseFormAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
] as unknown as () => void;
