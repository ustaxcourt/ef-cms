import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCaseInventoryReportDataAction } from '../actions/CaseInventoryReport/clearCaseInventoryReportDataAction';
import { getCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCaseInventoryReportAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateCaseInventoryFilterAction } from '../actions/CaseInventoryReport/updateCaseInventoryFilterAction';

export const getCaseInventoryReportSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  updateCaseInventoryFilterAction,
  {
    no: [setAlertErrorAction],
    proceed: [clearCaseInventoryReportDataAction, getCaseInventoryReportAction],
  },
]);
