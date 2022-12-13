import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveDocumentErrorSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  setShowModalAction,
];
