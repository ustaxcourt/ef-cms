import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { validateStatusReportOrderFormAction } from '../../actions/StatusReportOrder/validateStatusReportOrderFormAction';

export const validateStatusReportOrderSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    validateStatusReportOrderFormAction,
    {
      error: [setValidationErrorsAction, setValidationAlertErrorsAction],
      success: [clearAlertsAction],
    },
  ]),
] as unknown as () => void;
