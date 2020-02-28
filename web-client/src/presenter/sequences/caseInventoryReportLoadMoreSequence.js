import { getCaseInventoryReportSequence } from './getCaseInventoryReportSequence';
import { incrementScreenMetadataPageAction } from '../actions/incrementScreenMetadataPageAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const caseInventoryReportLoadMoreSequence = showProgressSequenceDecorator(
  [incrementScreenMetadataPageAction, ...getCaseInventoryReportSequence],
);
