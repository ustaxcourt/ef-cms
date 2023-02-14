import { getCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCaseInventoryReportAction';
import { incrementScreenMetadataPageAction } from '../actions/incrementScreenMetadataPageAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const caseInventoryReportLoadMoreSequence =
  showProgressSequenceDecorator([
    incrementScreenMetadataPageAction,
    getCaseInventoryReportAction,
  ]);
