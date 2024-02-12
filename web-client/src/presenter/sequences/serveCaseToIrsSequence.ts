import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const serveCaseToIrsSequence = [
  clearPdfPreviewUrlAction,
  setWaitingForResponseAction,
  serveCaseToIrsAction,
  {
    error: [setShowModalAction],
    success: [],
  },
];
