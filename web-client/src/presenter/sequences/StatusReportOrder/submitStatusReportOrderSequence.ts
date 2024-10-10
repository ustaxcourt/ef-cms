import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { prepareStatusReportOrderAction } from '../../actions/StatusReportOrder/prepareStatusReportOrderAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { submitCourtIssuedOrderSequence } from '@web-client/presenter/sequences/submitCourtIssuedOrderSequence';
import { validateStatusReportOrderFormAction } from '../../actions/StatusReportOrder/validateStatusReportOrderFormAction';

export const submitStatusReportOrderSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    validateStatusReportOrderFormAction,
    {
      error: [
        setValidationErrorsAction,
        setScrollToErrorNotificationAction,
        setValidationAlertErrorsAction,
      ],
      success: [
        prepareStatusReportOrderAction,
        submitCourtIssuedOrderSequence,
        {
          error: [setAlertErrorAction],
          success: [navigateToPathAction],
        },
      ],
    },
  ]),
] as unknown as () => void;
