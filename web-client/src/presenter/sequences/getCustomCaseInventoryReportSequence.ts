import { getCustomCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCustomCaseInventoryReportAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const getCustomCaseInventoryReportSequence =
  showProgressSequenceDecorator([getCustomCaseInventoryReportAction]);
