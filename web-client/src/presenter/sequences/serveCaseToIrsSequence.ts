import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const serveCaseToIrsSequence = [
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([serveCaseToIrsAction]),
];
