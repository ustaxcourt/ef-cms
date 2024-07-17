import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { prepareStatusReportOrderResponseAction } from '../../actions/StatusReportOrderResponse/prepareStatusReportOrderResponseAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { submitCourtIssuedOrderSequence } from '@web-client/presenter/sequences/submitCourtIssuedOrderSequence';
import { validateStatusReportOrderResponseFormAction } from '../../actions/StatusReportOrderResponse/validateStatusReportOrderResponseFormAction';

export const submitStatusReportOrderResponseSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    validateStatusReportOrderResponseFormAction,
    {
      error: [setValidationErrorsAction, setValidationAlertErrorsAction],
      success: [
        prepareStatusReportOrderResponseAction,
        submitCourtIssuedOrderSequence,
        {
          error: [setAlertErrorAction],
          success: [navigateToPathAction],
        },
      ],
    },
  ]),
] as unknown as () => void;
