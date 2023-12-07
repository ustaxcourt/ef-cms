import { clearModalAction } from '../actions/clearModalAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { setAlertFromExceptionAction } from '../actions/setAlertFromExceptionAction';
import { unsetWaitingForResponseOnErrorAction } from '../actions/unsetWaitingForResponseOnErrorAction';

export const unauthorizedErrorSequence = [
  unsetWaitingForResponseOnErrorAction,
  setAlertFromExceptionAction,
  clearModalAction,
  gotoLoginSequence,
];
