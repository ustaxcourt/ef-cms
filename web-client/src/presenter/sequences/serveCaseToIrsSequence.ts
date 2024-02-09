import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setWaitingTextAction } from '../actions/setWaitingTextAction';

export const serveCaseToIrsSequence = [
  clearPdfPreviewUrlAction,
  setWaitingForResponseAction,
  setWaitingTextAction(
    'Please stay on this page while we process your request.',
  ),
  serveCaseToIrsAction,
  {
    error: [setShowModalAction],
    success: [],
  },
];
