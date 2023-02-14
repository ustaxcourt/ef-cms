import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseInventoryReportModalAction } from '../actions/CaseInventoryReport/validateCaseInventoryReportModalAction';

export const validateCaseInventoryReportModalSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseInventoryReportModalAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
