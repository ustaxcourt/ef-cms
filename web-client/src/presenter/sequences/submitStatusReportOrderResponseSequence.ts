import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { validateStatusReportOrderResponseFormAction } from '../actions/validateStatusReportOrderResponseFormAction';

export const submitStatusReportOrderResponseSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    validateStatusReportOrderResponseFormAction,
    {
      error: [setValidationErrorsAction, setValidationAlertErrorsAction],
      success: [
        // TODO make an action that creates the order
        // submitStatusReportOrderResponseAction,
        {
          error: [setAlertErrorAction],
          success: [navigateToPathAction],
        },
      ],
    },
  ]),
] as unknown as () => void;
