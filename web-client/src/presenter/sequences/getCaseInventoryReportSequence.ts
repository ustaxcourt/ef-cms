import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCaseInventoryReportDataAction } from '../actions/CaseInventoryReport/clearCaseInventoryReportDataAction';
import { getCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCaseInventoryReportAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updateScreenMetadataSequence } from './updateScreenMetadataSequence';

export const getCaseInventoryReportSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  updateScreenMetadataSequence,
  clearCaseInventoryReportDataAction,
  getCaseInventoryReportAction,
]);
