import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateCaseInventoryReportModalAction } from '../actions/CaseInventoryReport/validateCaseInventoryReportModalAction';

export const getCaseInventoryReportSequence = [
  startShowValidationAction,
  validateCaseInventoryReportModalAction,
  {
    error: [setValidationErrorsAction],
    success: [],
  },
];
