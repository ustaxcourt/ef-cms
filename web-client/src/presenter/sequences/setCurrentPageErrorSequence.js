import { clearModalAction } from '../actions/clearModalAction';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const setCurrentPageErrorSequence = [
  unsetWaitingForResponseAction,
  setAlertFromExceptionAction,
  clearModalAction,
];
