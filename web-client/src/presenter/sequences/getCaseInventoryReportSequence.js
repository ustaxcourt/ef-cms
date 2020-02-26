import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCaseInventoryReportAction';
import { navigateToCaseInventoryReportAction } from '../actions/CaseInventoryReport/navigateToCaseInventoryReportAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateCaseInventoryReportModalAction } from '../actions/CaseInventoryReport/validateCaseInventoryReportModalAction';

export const getCaseInventoryReportSequence = [
  startShowValidationAction,
  validateCaseInventoryReportModalAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearModalAction,
      getCaseInventoryReportAction,
      clearModalStateAction,
      navigateToCaseInventoryReportAction,
    ]),
  },
];
