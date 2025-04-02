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

export const submitMotionOrderResponseSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
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
          success: [navigateToPathAction],
        },
      ],
    },
  ]),
] as unknown as () => void;
