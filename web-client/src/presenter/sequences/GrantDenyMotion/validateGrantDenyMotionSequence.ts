import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { validateGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/validateGrantDenyMotionFormAction';

export const validateGrantDenyMotionSequence = [
  clearAlertsAction,
  validateGrantDenyMotionFormAction,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [clearAlertsAction],
  },
] as unknown as () => void;
