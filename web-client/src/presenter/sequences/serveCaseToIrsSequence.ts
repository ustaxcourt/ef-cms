import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const serveCaseToIrsSequence = [
  clearPdfPreviewUrlAction,
  setWaitingForResponseAction,
  serveCaseToIrsAction,
];
