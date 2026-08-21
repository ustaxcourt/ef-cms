import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { prepareGrantDenyMotionAction } from '@web-client/presenter/actions/GrantDenyMotion/prepareGrantDenyMotionAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';
import { submitCourtIssuedOrder } from '@web-client/presenter/sequences/submitCourtIssuedOrderSequence';
import { validateGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/validateGrantDenyMotionFormAction';

export const submitGrantDenyMotionSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    startShowValidationAction,
    validateGrantDenyMotionFormAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        prepareGrantDenyMotionAction,
        submitCourtIssuedOrder,
        {
          error: [setAlertErrorAction],
          success: [stopShowValidationAction, navigateToPathAction],
        },
      ],
    },
  ]),
] as unknown as () => void;
