import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { prepareMotionOrderResponseAction } from '../../actions/MotionOrderResponse/prepareMotionOrderResponseAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { submitCourtIssuedOrder } from '@web-client/presenter/sequences/submitCourtIssuedOrderSequence';
import { validateMotionOrderResponseFormAction } from '../../actions/MotionOrderResponse/validateMotionOrderResponseFormAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { stopShowValidationAction } from '@web-client/presenter/actions/stopShowValidationAction';

export const submitMotionOrderResponseSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    startShowValidationAction,
    validateMotionOrderResponseFormAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        prepareMotionOrderResponseAction,
        submitCourtIssuedOrder,
        {
          error: [setAlertErrorAction],
          success: [stopShowValidationAction, navigateToPathAction],
        },
      ],
    },
  ]),
] as unknown as () => void;
