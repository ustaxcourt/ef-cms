import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { clearGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/clearGrantDenyMotionFormAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';

export const clearGrantDenyMotionFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearErrorAlertsAction,
  clearGrantDenyMotionFormAction,
] as unknown as () => void;
