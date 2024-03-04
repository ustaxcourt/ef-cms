import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setShowModalAction } from '../actions/setShowModalAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const serveToIrsErrorSequence = [
  unsetWaitingForResponseAction,
  clearModalStateAction,
  setShowModalAction,
];
