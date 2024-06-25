import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { prepareStatusReportOrderResponseAction } from '../actions/prepareStatusReportOrderResponseAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitCourtIssuedOrderSequence } from '@web-client/presenter/sequences/submitCourtIssuedOrderSequence';
import { validateStatusReportOrderResponseFormAction } from '../actions/validateStatusReportOrderResponseFormAction';

export const submitStatusReportOrderResponseSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    validateStatusReportOrderResponseFormAction,
    {
      error: [setValidationErrorsAction, setValidationAlertErrorsAction],
      success: [
        // TODO: Recommend reusing submitCourtIssuedOrderSequence, therefore make sure we're setting the correct form fields here.
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
