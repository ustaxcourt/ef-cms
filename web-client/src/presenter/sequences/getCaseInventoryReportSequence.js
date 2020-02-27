import { getCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCaseInventoryReportAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const getCaseInventoryReportSequence = showProgressSequenceDecorator([
  getCaseInventoryReportAction,
]);
