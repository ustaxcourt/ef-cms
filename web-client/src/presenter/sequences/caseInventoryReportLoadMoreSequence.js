import { getCaseInventoryReportAction } from '../actions/CaseInventoryReport/getCaseInventoryReportAction';
import { incrementScreenMetadataPageAction } from '../actions/incrementScreenMetadataPageAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const caseInventoryReportLoadMoreSequence =
  showProgressSequenceDecorator([
    incrementScreenMetadataPageAction,
    getCaseInventoryReportAction,
  ]);
